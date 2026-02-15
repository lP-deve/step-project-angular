import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
  private baseUrl = 'https://hotelbooking.stepprojects.ge/api/Booking';

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl);
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`);
  }
}
