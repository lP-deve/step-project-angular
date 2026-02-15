import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../services/hotel-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './detailspage.html',
  styleUrls: ['./detailspage.css'],
})
export class Detailspage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);

  room = signal<any>(null);
  items: any[] = [];
  currentImageIndex = 0;

  customerName: string = '';
  customerPhone: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';

  bookingMessage: string = '';
  bookingError: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.hotelService.ApiData().subscribe((items: any[]) => {
        this.items = items;
        const found = items.find(r => r.id === id);
        this.room.set(found || null);
        this.currentImageIndex = 0;
      });
    });
  }

  nextImage() {
    const images = this.room()?.images || [];
    if (!images.length) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
  }

  prevImage() {
    const images = this.room()?.images || [];
    if (!images.length) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
  }
   
  submitBooking() {
  if (!this.room()) {
    this.bookingError = 'Room not loaded.';
    return;
  }

  if (!this.customerName || !this.customerPhone || !this.checkInDate || !this.checkOutDate) {
    this.bookingError = 'Please fill all required fields.';
    return;
  }

  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);

  if (checkOut <= checkIn) {
    this.bookingError = 'Check-out date must be after check-in date.';
    return;
  }


  const nights =
    (checkOut.getTime() - checkIn.getTime()) /
    (1000 * 60 * 60 * 24);

 
  const totalPrice = nights * this.room().pricePerNight;

 const payload = {
  roomID: this.room().id,
  checkInDate: checkIn.toISOString(),
  checkOutDate: checkOut.toISOString(),
  totalPrice: totalPrice,
  isConfirmed: true,               
  customerName: this.customerName,
  customerId: '1',                
  customerPhone: this.customerPhone
};


  console.log('Booking payload:', payload);

  this.hotelService.createBooking(payload).subscribe({
    next: (res) => {
      this.bookingMessage = res; 
      this.bookingError = '';
      this.customerName = '';
      this.customerPhone = '';
      this.checkInDate = '';
      this.checkOutDate = '';
    },
    error: (err) => {
  if (err.error?.includes('already booked')) {
    this.bookingError = 'This room is already booked for selected dates. Please choose different dates.';
  } else {
    this.bookingError = err.error || 'Booking failed.';
  }
}

  });
}



}
