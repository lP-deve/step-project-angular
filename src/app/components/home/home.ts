import { Component, computed, signal } from '@angular/core';
import { Homechild } from '../homechild/homechild';

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
  selector: 'app-home',
  standalone: true,
  imports: [Homechild],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  rooms = signal<Room[]>([]);
  private readonly baseUrl = 'https://hotelbooking.stepprojects.ge';

  constructor() {
    this.loadRooms();
  }

  private normalizeImage(img: any): string {
    if (!img) return '';
    const src = typeof img === 'string' ? img : img?.source ?? img?.url ?? img?.path ?? '';
    if (!src) return '';
    return src.startsWith('http') ? src : `${this.baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
  }

  private async loadRooms(): Promise<void> {
    try {
      const data: any[] = await fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll')
        .then(res => res.json()) ?? [];

      this.rooms.set(
        data.map(r => ({
          id: r.id,
          hotelId: r.hotelId,
          name: r.name,
          description: r.description,
          price: r.pricePerNight,
          images: (r.images ?? []).map(this.normalizeImage).filter(Boolean),
          amenities: r.amenities ?? [],
        }))
      );
    } catch (err) {
      console.error('Error loading rooms', err);
      this.rooms.set([]);
    }
  }

  topRooms = computed(() => this.rooms().slice(0, 6));
}
