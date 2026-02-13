import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HotelType } from './typesDefined';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
   http = inject(HttpClient)

   ApiData(){
    const url = 'https://hotelbooking.stepprojects.ge/api/Rooms/GetAll'
    return this.http.get<Array<HotelType>>(url)
   }
}
