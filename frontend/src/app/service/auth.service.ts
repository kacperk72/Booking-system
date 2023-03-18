import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  proceedLogin(usercred: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      'http://localhost:3001/user/login',
      usercred
    );
  }

  IsLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  GetToken(): string {
    return localStorage.getItem('token') || '';
  }

  Logout(): void {
    window.alert('Wylogowano');
    localStorage.clear();
    this.router.navigate(['/zaloguj']);
  }

  GetRolebyToken(token: any) {
    if (token !== '') {
      const _extractedtoken = token.split('.')[1];
      const atobData = atob(_extractedtoken);
      const _finalData = JSON.parse(atobData);
      return _finalData;
    } else {
      console.log('Brak tokenu');
      return false;
    }
  }

  HaveAccessAdmin(): boolean {
    const loggingtoken = this.GetToken();
    const _finalData = this.GetRolebyToken(loggingtoken);
    if (_finalData.role === 'admin') {
      return true;
    }
    window.alert('Brak dostępu');
    return false;
  }
}
