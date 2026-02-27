import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MService } from '../../services/m-service';
import { AllRooms } from '../../services/all-rooms';

// Define the interface directly here to replace Ytype
interface Hotel {
  id: number;
  name: string;
  featuredImage?: string;
  address?: string;
  // Add other properties if you use them in your HTML
}

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels implements OnInit {
  // Injecting the data service and the image helper service
  private hotelService = inject(MService);
  public allRooms = inject(AllRooms);

  // Signal holding an array of Hotels
  hotelinfo2 = signal<Hotel[]>([]);

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.hotelService.getHotelsinf().subscribe({
      next: (data: Hotel[]) => {
        this.hotelinfo2.set(data);
      },
      error: (err) => {
        console.error('Failed to load hotels:', err);
      }
    });
  }
}