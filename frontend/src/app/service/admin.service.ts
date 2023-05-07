import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getReservations(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/admin/reservation-list');
  }

  getRooms(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/room-list');
  }

  setReservation(reservation: any): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3000/add-reservation',
      reservation
    );
  }
}
