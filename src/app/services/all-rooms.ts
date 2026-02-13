import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AllRooms {
  private api = 'https://hotelbooking.stepprojects.ge/api/Rooms';

  roomTypes = signal<any[]>([]);
  rooms = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  fetchRoomTypes() {
    this.http
      .get<any[]>(`${this.api}/GetRoomTypes`)
      .subscribe(res => this.roomTypes.set(res));
  }

  fetchRooms() {
    this.http.get<any[]>(`${this.api}/GetAvailableRooms`) // or GET with params if needed
      .subscribe(res => this.rooms.set(res));
  }

  fullImage(url: string) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://hotelbooking.stepprojects.ge/' + url;
  }
}
