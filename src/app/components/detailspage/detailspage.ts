import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router
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
  isModalOpen = signal(false); // Modal State

  // Form Fields
  customerName = '';
  customerPhone = '';
  checkInDate = '';
  checkOutDate = '';
  
  // Validation States
  submitted = false;
  bookingError = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.allRooms.getRoomById(id).subscribe((data) => {
          this.room.set(data);
        });
      }
    });
  }

  // --- Image Slider ---
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
  
  if (!this.customerName || !this.customerPhone || !this.checkInDate || !this.checkOutDate) {
    return; 
  }

  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);

  if (checkOut <= checkIn) {
    this.bookingError = 'Check-out must be after check-in.';
    return;
  }

  // Calculate nights and round the total price to 2 decimal places
  const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);
  const calculatedPrice = nights * (currentRoom.pricePerNight || 0);

  const payload = {
    roomID: Number(currentRoom.id), // Ensure this is a Number
    // Use the raw string from the input (YYYY-MM-DD) instead of toISOString() 
    // to see if your backend prefers the simpler format
    checkInDate: this.checkInDate, 
    checkOutDate: this.checkOutDate,
    totalPrice: Math.round(calculatedPrice * 100) / 100, // Round to 2 decimals
    isConfirmed: true,
    customerName: this.customerName,
    // Some backends fail if the ID is too long or contains symbols
    customerId: "CUST-" + Math.floor(Math.random() * 100000), 
    customerPhone: this.customerPhone
  };

  console.log('Sending Payload:', payload); // Check your console to see exactly what is sent

  this.allRooms.createBooking(payload).subscribe({
    next: () => {
      this.isModalOpen.set(true);
      this.resetForm();
    },
    error: (err) => {
      // Log the actual server error details
      console.error("Server says:", err.error); 
      this.bookingError = err.error?.message || 'Booking failed. Data format error (400).';
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
    this.router.navigate(['/rooms']); // Navigate back to list
  }
}