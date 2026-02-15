import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService, Booking } from '../../services/booking-service';

@Component({
  selector: 'app-booked-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booked-rooms.html',
  styleUrls: ['./booked-rooms.css'],
})
export class BookedRooms implements OnInit {
  private bookingService = inject(BookingService);
  bookings: Booking[] = [];

ngOnInit() {
  this.bookingService.getBookings().subscribe({
    next: (b: any) => {
      console.log('API RESPONSE:', b);

      this.bookings = Array.isArray(b)
        ? b
        : b?.data ?? [];

      console.log('FINAL BOOKINGS ARRAY:', this.bookings);
    },
    error: (e) => {
      console.error('Failed to load bookings', e);
      this.bookings = [];
    },
  });
}


}
