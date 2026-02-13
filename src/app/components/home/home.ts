import { Component, inject, OnInit, signal } from '@angular/core';
import { Homechild } from '../homechild/homechild';
import { Homechild2 } from '../homechild2/homechild2';
import { HotelService } from '../../services/hotel-service';
import { HotelType } from '../../services/typesDefined';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Homechild, Homechild2],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private hotelService = inject(HotelService);

  rooms = signal<HotelType[]>([]);

  ngOnInit(): void {
    this.hotelService.ApiData().subscribe((items) => {
          console.log('API DATA:', items);
        this.rooms.set(items.slice(0, 6)); 
    });
  }

  onSelected(room: HotelType) {
    console.log('Selected:', room);
  }
}
