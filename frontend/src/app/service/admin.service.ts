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
    const salaID = reservation.room;
    const mail = reservation.mail;
    const course = '';

    let dateParts = reservation.date.split('.');
    let formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    let hours = reservation.hour.split(' - ');
    let datetime1 = new Date(`${formattedDate} ${hours[0]}:00`);
    let datetime2 = new Date(`${formattedDate} ${hours[1]}:00`);

    const start = datetime1;
    const end = datetime2;
    const acceptationState = 'waiting';

    const res = {
      salaID,
      mail,
      course,
      start,
      end,
      acceptationState,
    };
    return this.http.post<any>('http://localhost:3000/add-reservation', res);
  }

  deleteReservation(reservationID: string): Observable<any> {
    return this.http.delete(
      `http://localhost:3000/admin/deleteReservation/${reservationID}`
    );
  }

  approveReservation(reservationID: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/admin/aproveRes/${reservationID}`,
      { observe: 'response' }
    );
  }
}
