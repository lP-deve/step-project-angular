import { Component, inject, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllRooms } from '../../services/all-rooms';
import { RouterLink, RouterModule } from '@angular/router';

// Angular Material Imports
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'; // Added
import { provideNativeDateAdapter } from '@angular/material/core'; // Added

@Component({
  selector: 'app-rooms',
  standalone: true,
  providers: [provideNativeDateAdapter()], // Required for Datepicker
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule, // Added
  ],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css'],
})
export class Rooms implements OnInit {
  allRooms = inject(AllRooms);
  isLoading = signal(true);

  draftType: number | 'All' = 'All';
  draftMin = 0;
  draftMax = 1000;
  draftGuests: number | null = null;
  draftCheckIn: Date | null = null; // Changed to Date type for picker compatibility
  draftCheckOut: Date | null = null; // Changed to Date type for picker compatibility

  sliderMin = 0;
  sliderMax = 1000;
  private sliderInitialized = false;

  constructor() {
    effect(() => {
      const rooms = this.allRooms.rooms();
      if (rooms !== null) {
        this.isLoading.set(false);
        if (rooms.length > 0 && !this.sliderInitialized) {
          const prices = rooms.map((r: any) => r.pricePerNight ?? 0);
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
  }

  selectCategory(type: number | 'All') {
    this.draftType = type;
    this.applyFilters();
  }

  applyFilters() {
    this.isLoading.set(true);
    
    // Convert Dates to ISO strings if they exist for the API payload
    const payload = {
      roomTypeId: this.draftType === 'All' ? null : this.draftType,
      priceFrom: this.draftMin,
      priceTo: this.draftMax,
      maximumGuests: this.draftGuests,
      checkIn: this.draftCheckIn ? this.draftCheckIn.toISOString() : null,
      checkOut: this.draftCheckOut ? this.draftCheckOut.toISOString() : null
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