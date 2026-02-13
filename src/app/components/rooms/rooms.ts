import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllRooms } from '../../services/all-rooms';
import { Roomtype } from '../../services/typesDefined';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rooms.html',
  styleUrls: ['./rooms.css'],
})
export class Rooms implements OnInit {
  allRooms = inject(AllRooms);

  selectedType = signal<number | 'All'>('All');

  sliderMin = 0;
  sliderMax = 1000;

  minValue = signal(0);
  maxValue = signal(1000);

  filteredRooms = computed<Roomtype[]>(() => {
    let rooms = this.allRooms.rooms();

    const typeId = this.selectedType();
    if (typeId !== 'All') rooms = rooms.filter(r => r.roomTypeId === typeId);

    rooms = rooms.filter(
      r => (r.pricePerNight ?? 0) >= this.minValue() &&
           (r.pricePerNight ?? 0) <= this.maxValue()
    );

    return rooms;
  });

  ngOnInit(): void {
    // Fetch types and rooms first
    this.allRooms.fetchRoomTypes();
    this.allRooms.fetchRooms();

    // Wait until rooms are loaded to compute price min/max
    this.allRooms.rooms().forEach(() => {
      const prices = this.allRooms.rooms().map(r => r.pricePerNight ?? 0);
      if (prices.length) {
        this.sliderMin = Math.min(...prices);
        this.sliderMax = Math.max(...prices);

        this.minValue.set(this.sliderMin);
        this.maxValue.set(this.sliderMax);
      }
    });
  }

  setType(typeId: number | 'All') {
    this.selectedType.set(typeId);
  }

  onMinChange(value: number) {
    if (value > this.maxValue()) this.minValue.set(this.maxValue());
    else this.minValue.set(value);
  }

  onMaxChange(value: number) {
    if (value < this.minValue()) this.maxValue.set(this.minValue());
    else this.maxValue.set(value);
  }

  img(url: string) {
    return this.allRooms.fullImage(url);
  }
}
