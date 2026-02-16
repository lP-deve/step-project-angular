import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllRooms } from '../../services/all-rooms';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css'],
})
export class Rooms implements OnInit {
  allRooms = inject(AllRooms);
  isLoading = signal(false);

  // --- Filter Drafts ---
  draftType: number | 'All' = 'All';
  draftMin = 0;
  draftMax = 2000; 
  draftGuests: number | null = null;
  draftCheckIn: string | null = null;
  draftCheckOut: string | null = null;

  // --- Slider Boundaries ---
  sliderMin = 0;
  sliderMax = 2000;
  private sliderInitialized = false;

  constructor() {
    effect(() => {
      const currentRooms = this.allRooms.rooms();
      // If we have data (even empty array), stop loading
      if (currentRooms) {
        this.isLoading.set(false);
      }

      // Initialize sliders based on real price data
      if (currentRooms.length > 0 && !this.sliderInitialized) {
        const prices = currentRooms.map(r => r.pricePerNight ?? 0);
        this.sliderMin = Math.min(...prices);
        this.sliderMax = Math.max(...prices);
        this.draftMin = this.sliderMin;
        this.draftMax = this.sliderMax;
        this.sliderInitialized = true;
      }
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.allRooms.fetchRoomTypes();
    this.allRooms.fetchRooms(); // Initial fetch
    
    // Safety: If server 504s, don't leave spinner forever
    setTimeout(() => { if(this.isLoading()) this.isLoading.set(false); }, 8000);
  }

  selectCategory(type: number | 'All') {
    this.draftType = type;
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading.set(true);

    // CLEAN PAYLOAD: Do not send nulls or 'All' to the API
    const payload: any = {};
    if (this.draftType !== 'All') payload.roomTypeId = Number(this.draftType);
    if (this.draftMin !== null) payload.priceFrom = this.draftMin;
    if (this.draftMax !== null) payload.priceTo = this.draftMax;
    if (this.draftGuests) payload.maximumGuests = this.draftGuests;
    if (this.draftCheckIn) payload.checkIn = this.draftCheckIn;
    if (this.draftCheckOut) payload.checkOut = this.draftCheckOut;

    console.log('Filtered Search:', payload);
    this.allRooms.getFilteredRooms(payload);
  }

  resetFilters() {
    this.isLoading.set(true);
    this.draftType = 'All';
    this.draftGuests = null;
    this.draftCheckIn = null;
    this.draftCheckOut = null;
    this.draftMin = this.sliderMin;
    this.draftMax = this.sliderMax;
    this.allRooms.fetchRooms();
  }
}