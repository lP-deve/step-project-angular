import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllRooms } from '../../services/all-rooms'; // Ensure this path is correct

@Component({
  selector: 'app-booked-rooms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booked-rooms.html',
  styleUrls: ['./booked-rooms.css']
})
export class BookedRooms implements OnInit {
  // Inject the service as public so the HTML can use its methods
  public allRooms = inject(AllRooms);
  myBookings = signal<any[]>([]);

   ngOnInit(): void {
    const data = localStorage.getItem('user_bookings');
    if (data) {
      this.myBookings.set(JSON.parse(data));
    }}

  refreshBookings() {
    const data = localStorage.getItem('user_bookings');
    if (data) {
      this.myBookings.set(JSON.parse(data));
    }
  }

  cancelBooking(id: number, index: number) {
    if (confirm('Cancel this booking?')) {
      const current = this.myBookings();
      current.splice(index, 1);
      localStorage.setItem('user_bookings', JSON.stringify(current));
      this.myBookings.set([...current]);
    }
  }
}