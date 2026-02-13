import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ytype } from './typesDefined';


@Injectable({
  providedIn: 'root',
})
export class MService {
  
   private http = inject(HttpClient);

  private apiUrl = 'https://hotelbooking.stepprojects.ge/api/Hotels/GetAll';

  getHotelsinf() {
    return this.http.get<Ytype[]>(this.apiUrl);
}

}


