



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