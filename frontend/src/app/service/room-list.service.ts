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
    NazwaSali: string,
    IloscMiejsc: number,
    TypSali: string
  ) {
    let params = new HttpParams()
      .set('NazwaSali', NazwaSali)
      .set('IloscMiejsc', IloscMiejsc.toString())
      .set('TypSali', TypSali);

    return this.http.get<any>('http://localhost:3000/filter-rooms', { params });
  }
}
