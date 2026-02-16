import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AllRooms } from '../../services/all-rooms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detailspage.html',
  styleUrls: ['./detailspage.css'],
})
export class Detailspage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public allRooms = inject(AllRooms);

  room = signal<any>(null);
  currentImageIndex = 0;
  isModalOpen = signal(false);

  customerName = '';
  customerPhone = '';
  checkInDate = '';
  checkOutDate = '';
  
  submitted = false;
  bookingError = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.allRooms.getRoomById(id).subscribe({
          next: (data) => this.room.set(data),
          error: (err) => {
            this.bookingError = "Failed to load room details.";
            console.error(err);
          }
        });
      }
    });
  }

  nextImage() {
    const images = this.room()?.images || [];
    if (images.length) this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
  }

  prevImage() {
    const images = this.room()?.images || [];
    if (images.length) this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
  }

  submitBooking() {
    this.submitted = true;
    const currentRoom = this.room();
    
    if (!this.customerName || !this.customerPhone || !this.checkInDate || !this.checkOutDate) return; 

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    if (checkOut <= checkIn) {
      this.bookingError = 'Check-out must be after check-in.';
      return;
    }

    const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
    const calculatedPrice = nights * (currentRoom.pricePerNight || 0);

    const payload = {
      roomID: Number(currentRoom.id),
      checkInDate: this.checkInDate, 
      checkOutDate: this.checkOutDate,
      totalPrice: Math.round(calculatedPrice * 100) / 100,
      isConfirmed: true,
      customerName: this.customerName,
      customerId: "CUST-" + Math.floor(Math.random() * 100000), 
      customerPhone: this.customerPhone
    };

    this.allRooms.createBooking(payload).subscribe({
      next: () => {
        this.isModalOpen.set(true);
        this.resetForm();
      },
      error: (err) => {
        // Some APIs return the error as a string, others as an object
        const errorMessage = typeof err.error === 'string' ? err.error : err.error?.message;
        this.bookingError = errorMessage || 'Booking failed. Check date availability.';
      }
    });
  }

  resetForm() {
    this.submitted = false;
    this.customerName = '';
    this.customerPhone = '';
    this.checkInDate = '';
    this.checkOutDate = '';
    this.bookingError = '';
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.router.navigate(['/rooms']);
  }
}