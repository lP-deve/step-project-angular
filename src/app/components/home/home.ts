import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Homechild } from '../homechild/homechild';
import { Homechild2 } from '../homechild2/homechild2';
import { AllRooms } from '../../services/all-rooms'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Homechild, Homechild2],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  private allRoomsService = inject(AllRooms);
  private router = inject(Router);

  rooms = signal<any[]>([]);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const allData = this.allRoomsService.rooms(); 
      
      // Update local rooms signal and stop loading when data arrives
      if (allData && allData.length > 0) {
        this.rooms.set(allData.slice(0, 6));
        // Small timeout ensures the UI has time to register the state change
        setTimeout(() => this.isLoading.set(false), 200);
      }
    });
  }

  ngOnInit(): void {
    
    this.rooms.set([]); 
    this.isLoading.set(true);
    
    this.allRoomsService.fetchRooms();
  }

  onSelected(room: any) {
    if (room && room.id) {
     
      this.router.navigate(['/room', room.id]); 
    } else {
      console.error("Room object or ID is missing!", room);
    }
  }
}