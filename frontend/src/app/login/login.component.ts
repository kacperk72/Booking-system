import { Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from '../service/login.service';

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

  constructor(private fb: FormBuilder, private router: Router) {
    // localStorage.clear();
  }

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
      localStorage.setItem('rola', 'admin');
      this.router.navigate(['/']);
    } else {
      window.alert('nieudana próba logowania');
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
