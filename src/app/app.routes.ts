import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Rooms } from './components/rooms/rooms';
import { Hotels } from './components/hotels/hotels';
import { BookedRooms } from './components/booked-rooms/booked-rooms';

export const routes: Routes = [
    {path:'', component:Home},
    {path:'rooms', component:Rooms},
    {path:'hotels', component:Hotels},
    {path:'booked', component:BookedRooms},
];
