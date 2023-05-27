import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IReservation {
  salaId: number;
  mail: string;
  course: string;
  start: string;
  end: string;
  acceptationState: string;
}
@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  addReservation(reservation: IReservation): Observable<any> {
    console.log('dodawanie rezerwacji');
    return this.http.post<any>(
      'http://localhost:3000/add-reservation',
      reservation
    );
  }

  cancelReservation(): void {}

  getReservationsToAccept(): void {}
}
