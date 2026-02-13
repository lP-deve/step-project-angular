import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelType } from '../../services/typesDefined';

@Component({
  selector: 'app-homechild',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homechild.html',
  styleUrls: ['./homechild.css'],
})
export class Homechild {
  @Input() rooms: HotelType[] = [];
  @Output() selectedHotel = new EventEmitter<HotelType>();

  select(room: HotelType) {
    this.selectedHotel.emit(room);
  }

  trackById(index: number, room: HotelType) {
    return room.id;
  }
}
