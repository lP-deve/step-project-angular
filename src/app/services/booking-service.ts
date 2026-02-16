import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface Booking {
  id: number;
  roomID: number;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  isConfirmed: boolean;
  customerName: string;
  customerId: string;
  customerPhone: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  
  // Ensure this matches your proxy.conf.json or backend URL
  private baseUrl = '/api/Booking';

  /** * Fetches all bookings from the server 
   */
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl).pipe(
      catchError(err => {
        console.error("Booking Fetch Error:", err);
        // Returns an empty array so the app doesn't crash on error
        return of([]); 
      })
    );
  }

  /** * Fetches a single booking by its ID 
   */
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`);
  }
}