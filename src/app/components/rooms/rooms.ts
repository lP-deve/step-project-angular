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
  
  // Set to TRUE by default so spinner shows immediately on page load
  isLoading = signal(true); 

  draftType: number | 'All' = 'All';
  draftMin = 0;
  draftMax = 2000; 
  draftGuests: number | null = null;
  draftCheckIn: string | null = null;
  draftCheckOut: string | null = null;

  sliderMin = 0;
  sliderMax = 2000;
  private sliderInitialized = false;

  constructor() {
    effect(() => {
      const currentRooms = this.allRooms.rooms();
      
      // Stop loading ONLY after the rooms signal has been updated with data from the service
      if (currentRooms !== null && currentRooms !== undefined) {
        this.isLoading.set(false);
      }

      if (currentRooms && currentRooms.length > 0 && !this.sliderInitialized) {
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
    // isLoading is already true, but we call fetches here
    this.allRooms.fetchRoomTypes();
    this.allRooms.fetchRooms(); 
    
    // Safety fallback for timeouts
    setTimeout(() => { 
      if(this.isLoading()) this.isLoading.set(false); 
    }, 10000);
  }

  selectCategory(type: number | 'All') {
    this.draftType = type;
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading.set(true);
    const payload: any = {};
    if (this.draftType !== 'All') payload.roomTypeId = Number(this.draftType);
    payload.priceFrom = this.draftMin;
    payload.priceTo = this.draftMax;
    if (this.draftGuests) payload.maximumGuests = this.draftGuests;
    if (this.draftCheckIn) payload.checkIn = this.draftCheckIn;
    if (this.draftCheckOut) payload.checkOut = this.draftCheckOut;

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