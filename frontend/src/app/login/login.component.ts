import { Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../service/login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class LoginComponent {
  @ViewChild('authLink') authLink!: ElementRef;
  loginForm!: FormGroup;
  loginData = {};
  userLogin = '';
  userPassword = '';
  authCode = '';
  responsedata: any;
  actualRole = '';

  private subproceedLogin$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: LoginService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [this.userLogin, Validators.required],
      password: [this.userPassword, Validators.required],
      code: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (this.subproceedLogin$) {
      this.subproceedLogin$.unsubscribe();
    }
  }

  async logging(): Promise<void> {
    this.userLogin = this.loginForm.get('login')?.value;
    this.userPassword = this.loginForm.get('password')?.value;
    this.authCode = this.loginForm.get('code')?.value;
    this.loginData = { login: this.userLogin, password: this.userPassword };
    const isAuthorized = await this.checkAuthorizationCode(this.authCode);

    if (
      this.userLogin === 'admin' &&
      this.userPassword === 'admin' &&
      isAuthorized
    ) {
      this.cookieService.set('rola', 'admin', 0.007); // Ustawia ciasteczko z wygaśnięciem po 10 minutach
      this.router.navigate(['/']);
    } else {
      window.alert('nieudana próba logowania');
    }
  }

  checkInactivity() {
    if (this.cookieService.get('rola')) {
      // Jeżeli ciasteczko istnieje
      setTimeout(() => {
        // Ustawia timeout
        this.cookieService.delete('rola');
      }, 600000 * 12); // 600000 ms = 10 minuty
    }
  }

  getAuthorizationCode(event: MouseEvent) {
    event.preventDefault();
    this.service
      .GetUsosToken()
      .then((usosToken) => {
        console.log(usosToken);
        this.authLink.nativeElement.href = usosToken;
        window.open(usosToken, '_blank');
      })
      .catch((error) => {
        console.error('Error in exampleFunction:', error);
      });
  }

  async checkAuthorizationCode(code: string): Promise<boolean> {
    return await this.service.CheckUsosToken(code);
  }
}
