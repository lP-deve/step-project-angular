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
  isLoading = signal(true); 

  // --- Filter Drafts ---
  draftType: number | 'All' = 'All';
  draftMin = 0;
  draftMax = 1000; 
  draftGuests: number | null = null;
  draftCheckIn: string | null = null;
  draftCheckOut: string | null = null;

  // --- Slider Boundaries ---
  sliderMin = 0;
  sliderMax = 1000;
  private sliderInitialized = false;

  constructor() {
    effect(() => {
      const currentRooms = this.allRooms.rooms();
      
      // If currentRooms is no longer null, the API call finished.
      if (currentRooms !== null) {
        this.isLoading.set(false);

        // Initialize sliders based on the range of prices found in the data
        if (currentRooms.length > 0 && !this.sliderInitialized) {
          const prices = currentRooms.map(r => r.pricePerNight ?? 0);
          this.sliderMin = Math.min(...prices);
          this.sliderMax = Math.max(...prices);
          this.draftMin = this.sliderMin;
          this.draftMax = this.sliderMax;
          this.sliderInitialized = true;
        }
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.allRooms.fetchRoomTypes();
    this.allRooms.fetchRooms(); 
    
    // Safety timeout to hide spinner if server is completely unresponsive
    setTimeout(() => { if(this.isLoading()) this.isLoading.set(false); }, 10000);
  }

  selectCategory(type: number | 'All') {
    this.draftType = type;
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading.set(true);
    const payload: any = {
      roomTypeId: this.draftType,
      priceFrom: this.draftMin,
      priceTo: this.draftMax,
      maximumGuests: this.draftGuests,
      checkIn: this.draftCheckIn,
      checkOut: this.draftCheckOut
    };

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