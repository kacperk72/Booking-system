import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  async GetUsosToken(): Promise<string> {
    try {
      const response = await this.http
        .get('http://localhost:8001/usos-token', { responseType: 'text' })
        .toPromise();
      if (response) {
        return response;
      } else {
        throw new Error('Response is empty or undefined');
      }
    } catch (error) {
      console.error('Error in getUsosToken:', error);
      return '';
    }
  }

  async CheckUsosToken(pin: string): Promise<boolean> {
    try {
      const params = new HttpParams().set('pin', pin);
      const response = await this.http
        .get('http://localhost:8001/check-usos-token', { params, responseType: 'text' })
        .toPromise();
      if (response) {
        return response === 'true';
      } else {
        throw new Error('Response is empty or undefined');
      }
    } catch (error) {
      console.error('Error in CheckUsosToken:', error);
      return false;
    }
  }






}
