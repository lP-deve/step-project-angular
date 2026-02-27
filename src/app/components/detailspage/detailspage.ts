import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { AllRooms } from '../../services/all-rooms';
import { MService } from '../../services/m-service'; // Import your hotel service
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detailspage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './detailspage.html',
  styleUrls: ['./detailspage.css'],
})
export class Detailspage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public allRooms = inject(AllRooms);
  private hotelService = inject(MService); // Injected to get hotel building info

  room = signal<any>(null);
  hotelBuilding = signal<any>(null); // To store the actual hotel building data
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
          next: (data) => {
            this.room.set(data);
            // After finding the room, we find the hotel it belongs to
            this.fetchHotelData(data.hotelId);
          },
          error: (err) => {
            console.error('Error fetching room:', err);
            this.bookingError = "Could not load room details.";
          }
        });
      }
    });
  }

  fetchHotelData(hotelId: number) {
    this.hotelService.getHotelsinf().subscribe((hotels: any[]) => {
      const foundHotel = hotels.find(h => h.id === hotelId);
      if (foundHotel) {
        this.hotelBuilding.set(foundHotel);
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
    const currentHotel = this.hotelBuilding();
    
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
      id: Date.now(),
      // Use actual hotel name from hotel API if available
      hotelName: currentHotel?.name || "Courtyard by Marriott Tbilisi",
      
      // FIXED: Use the image from the HOTEL data for the hotel column
      hotelImage: currentHotel?.featuredImage || currentHotel?.hotelImage || 'https://placehold.co/600x400?text=Hotel+Building', 
      
      // FIXED: Use the room's main image for the room column
      roomImage: currentRoom.featuredImage || (currentRoom.images?.length > 0 ? currentRoom.images[0].source : null),
      
      roomName: currentRoom.name,
      pricePerNight: currentRoom.pricePerNight,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      totalPrice: Math.round(calculatedPrice * 100) / 100,
      customerName: this.customerName,
      customerPhone: this.customerPhone
    };

    this.allRooms.createBooking(payload).subscribe({
      next: () => {
        this.saveToLocal(payload);
        this.isModalOpen.set(true);
      },
      error: (err) => {
        console.error('API booking error, saving to local anyway:', err);
        this.saveToLocal(payload);
        this.isModalOpen.set(true);
      }
    });
  }

  saveToLocal(booking: any) {
    const current = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    current.push(booking);
    localStorage.setItem('user_bookings', JSON.stringify(current));
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.router.navigate(['/booked']); 
  }
}