import { Component, inject, OnInit, signal } from '@angular/core';
import { Ytype } from '../../services/typesDefined';
import { MService } from '../../services/m-service';


@Component({
  selector: 'app-hotels',
  imports: [],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels implements OnInit{
   HotelInfo1  = inject(MService)
   hotelinfo2 = signal<Array<Ytype>>([])

   ngOnInit(): void {
      this.HotelInfo1.getHotelsinf().subscribe((item)=>{
        this.hotelinfo2.set(item)
        console.log(item)
      })
   }

}
