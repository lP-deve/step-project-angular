



export type RoomImage = {
  id: number;
  source: string;
  roomId: number;
};

export type Roomtype = {
  id: number;
  name: string;
  description?: string;
  pricePerNight?: number;
  available?: boolean;
  maximumGuests?: number;
  roomTypeId?: number;
  hotelId: number;
  bookedDates?: any[];
  images?: RoomImage[];
};



export type hotelImg = {
  id: number;
  source: string;
  roomId: number;
};

export type HotelType = {
  id: number;
  hotelId: number;
  name: string;
  description?: string;
  price?: number;
  images?: RoomImage[];
  amenities?: string[];
};


export type infoo ={
  id:number;
  type:string;
  price:number;
  amenities:string[];
  capacity:number;
}
export type Ytype ={
    id: number; 
    name: string;
     address: string;
      city: string;
       featuredImage: string; 
        rooms: infoo[];
}

export interface Room {
  id: number;
  name: string;
  pricePerNight: number;
  available: boolean;
  hotelId: number;
  images?: { source: string }[]; 
  description?: string;         
  maxGuests?: number;           
  type?: string;                
}
