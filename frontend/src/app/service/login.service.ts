import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  async CheckUsosToken(code: string): Promise<boolean> {
    try {
      const params = new HttpParams().set('code', code);
      const response = await this.http
        .get('http://localhost:8001/check-usos-token', {
          params,
          responseType: 'text',
        })
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

  login(login: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/admin/login', {
      login,
      password,
    });
  }
}
