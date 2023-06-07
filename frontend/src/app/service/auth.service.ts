import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  proceedLogin(usercred: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      'http://localhost:3001/user/login',
      usercred
    );
  }

  IsLoggedIn(): boolean {
    return this.cookieService.check('token');
  }

  GetToken(): string {
    return this.cookieService.get('token') || '';
  }

  Logout(): void {
    window.alert('Wylogowano');
    this.cookieService.delete('token');
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
