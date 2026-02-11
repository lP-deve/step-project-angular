import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

type Room = {
  id: number;
  hotelId: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  amenities: string[];
 };

@Component({
  selector: 'app-homechild',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './homechild.html',
  styleUrls: ['./homechild.css'],
})
export class Homechild {
  @Input() rooms: Room[] = [];
}
