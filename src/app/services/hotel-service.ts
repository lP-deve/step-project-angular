import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private http = inject(HttpClient);
  private baseUrl = 'https://hotelbooking.stepprojects.ge/api/';

  ApiData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}Rooms/GetAll`);
  }

 
  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}Rooms/GetRoom/${id}`);
  }

   createBooking(booking: any): Observable<string> {
  const url = `${this.baseUrl}Booking`;

  return this.http.post(url, booking, {
    responseType: 'text'
  });
}

}
