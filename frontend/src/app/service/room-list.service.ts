import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomListService {
  constructor(private http: HttpClient) {}

  getRoomsFromApi() {
    return this.http.get<any>('http://localhost:3000/room-list');
  }

  getFilteredRoomsFromApi(
    roomName: string,
    numberOfSeats: number,
    roomType: string
  ) {
    let params = new HttpParams()
      .set('roomName', roomName)
      .set('numberOfSeats', numberOfSeats.toString())
      .set('roomType', roomType);

    return this.http.get<any>('http://localhost:3000/filter-rooms', { params });
  }
}
