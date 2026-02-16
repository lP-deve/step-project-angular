import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllRooms {
  private http = inject(HttpClient);

  // Use Absolute URL to bypass Proxy errors (status 200, ok: false)
  private api = 'https://hotelbooking.stepprojects.ge/api/Rooms';
  private bookingApi = 'https://hotelbooking.stepprojects.ge/api/Booking';
  private imgBaseUrl = 'https://hotelbooking.stepprojects.ge';

  roomTypes = signal<any[]>([]);
  rooms = signal<any[] | null>(null);

  fetchRoomTypes() {
    if (this.roomTypes().length > 0) return;
    this.http.get<any[]>(`${this.api}/GetRoomTypes`).pipe(
      catchError(() => of([]))
    ).subscribe(res => this.roomTypes.set(res));
  }

  fetchRooms() {
    this.rooms.set(null); 
    this.getFilteredRooms({});
  }

  getFilteredRooms(payload: any) {
    const cleanPayload: any = {};
    Object.keys(payload).forEach(key => {
      const value = payload[key];
      if (value !== null && value !== undefined && value !== '' && value !== 'All') {
         cleanPayload[key] = value;
      }
    });

    this.http.get<any[]>(`${this.api}/GetAvailableRooms`, { params: cleanPayload }).pipe(
      catchError(err => {
        console.error('Filter Error:', err);
        return of([]); 
      })
    ).subscribe(res => {
      let serverData = Array.isArray(res) ? res : [];
      
      // Client-side fallback to ensure UI reacts even if API params are ignored
      if (cleanPayload.priceFrom !== undefined) serverData = serverData.filter(r => r.pricePerNight >= cleanPayload.priceFrom);
      if (cleanPayload.priceTo !== undefined) serverData = serverData.filter(r => r.pricePerNight <= cleanPayload.priceTo);
      if (cleanPayload.roomTypeId) serverData = serverData.filter(r => r.roomTypeId === Number(cleanPayload.roomTypeId));

      this.rooms.set(serverData);
    });
  }

  getRoomById(id: string | number) {
    return this.http.get<any>(`${this.api}/GetRoom/${id}`).pipe(
      catchError((err) => {
        console.error("Single Room Fetch failed:", err);
        return throwError(() => err);
      })
    );
  }

  createBooking(payload: any) {
    // Note: Absolute URL used here as well
    return this.http.post(this.bookingApi, payload, { responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Booking Error:', err);
        return throwError(() => err);
      })
    );
  }

  fullImage(images: any[] | null | undefined): string {
    if (!images || images.length === 0) return 'https://placehold.co/600x400?text=No+Image';
    const source = images[0]?.source;
    if (!source) return 'https://placehold.co/600x400?text=No+Image';
    if (source.startsWith('http')) return source;
    return `${this.imgBaseUrl}/${source.replace(/^\/+/, '')}`;
  }
}