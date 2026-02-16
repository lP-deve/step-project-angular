import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllRooms {
  private http = inject(HttpClient);

  // Use relative path to trigger Proxy
  private api = '/api/Rooms';
  private imgBaseUrl = 'https://hotelbooking.stepprojects.ge';

  // Signals
  roomTypes = signal<any[]>([]);
  rooms = signal<any[]>([]);

  fetchRoomTypes() {
    if (this.roomTypes().length > 0) return;
    this.http.get<any[]>(`${this.api}/GetRoomTypes`).pipe(
      catchError(() => of([]))
    ).subscribe(res => this.roomTypes.set(res));
  }

  fetchRooms() {
    // Get all rooms initially
    this.getFilteredRooms({});
  }

  getFilteredRooms(payload: any) {
    const cleanPayload: any = {};
    
    // 1. FIXED: Allow '0' values (important for Price From: 0)
    Object.keys(payload).forEach(key => {
      const value = payload[key];
      // We only remove null, undefined, or empty strings. We keep 0.
      if (value !== null && value !== undefined && value !== 'null' && value !== '') {
         cleanPayload[key] = value;
      }
    });

    console.log('API Request Params:', cleanPayload);

    // 2. Call API
    this.http.get<any[]>(`${this.api}/GetAvailableRooms`, { params: cleanPayload }).pipe(
      catchError(err => {
        console.error('Filter Error:', err);
        return of([]);
      })
    ).subscribe(res => {
      let serverData = res || [];

      // --- 3. SAFETY FILTER (Client-Side Fallback) ---
      // If the server returns ALL rooms despite filters, we filter them here manually.
      
      // Filter by Price
      if (cleanPayload.priceFrom !== undefined) {
        serverData = serverData.filter(r => r.pricePerNight >= cleanPayload.priceFrom);
      }
      if (cleanPayload.priceTo !== undefined) {
        serverData = serverData.filter(r => r.pricePerNight <= cleanPayload.priceTo);
      }

      // Filter by Room Type
      if (cleanPayload.roomTypeId) {
        serverData = serverData.filter(r => r.roomTypeId === cleanPayload.roomTypeId);
      }

      // Filter by Guests (if your room object has 'maximumGuests')
      if (cleanPayload.maximumGuests) {
        // Optional: Only filter if the property exists on the room
        serverData = serverData.filter(r => (r.maximumGuests || 99) >= cleanPayload.maximumGuests);
      }

      console.log('Filtered Results (Client Side):', serverData.length);
      
      // Update the signal with the CLEAN list
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
    return this.http.post('/api/Booking', payload, { responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Booking Error:', err);
        return throwError(() => err);
      })
    );
  }

  fullImage(images: any[] | null | undefined): string {
    if (!images || images.length === 0 || !images[0].source) {
      return 'https://placehold.co/600x400?text=No+Image';
    }
    const url = images[0].source;
    if (url.startsWith('http')) return url;
    const cleanPath = url.replace(/^\/+/, '');
    return `${this.imgBaseUrl}/${cleanPath}`;
  }
}