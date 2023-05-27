import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimetableService {
  constructor(private http: HttpClient) {}

  getRooms(): void {}

  getFilteredRooms(): void {}

  getTimetable(month: number, id: any): Observable<any> {
    return this.http.get<any>(
      `http://localhost:3000/get-month-data/${month}/${id}`
    );
  }
}
