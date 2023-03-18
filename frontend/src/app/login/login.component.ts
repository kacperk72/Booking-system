import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginData = {};
  userLogin = '';
  userPassword = '';
  responsedata: any;
  actualRole = '';

  private subproceedLogin$!: Subscription;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: [this.userLogin, Validators.required],
      password: [this.userPassword, Validators.required],
    });
  }

  ngOnDestroy(): void {
    if (this.subproceedLogin$) {
      this.subproceedLogin$.unsubscribe();
    }
  }

  logging(): void {
    this.userLogin = this.loginForm.get('login')?.value;
    this.userPassword = this.loginForm.get('password')?.value;
    this.loginData = { login: this.userLogin, password: this.userPassword };
    // console.log("this.loginData", this.loginData);

    this.subproceedLogin$ = this.service
      .proceedLogin(this.loginData)
      .subscribe((response: any) => {
        if (response != null) {
          this.responsedata = response;
          // console.log(this.responsedata);
          this.actualRole = this.responsedata.result.role;
          // console.log(this.actualRole);
          localStorage.setItem('token', this.responsedata.token);
          localStorage.setItem('rola', this.actualRole);
          this.router.navigate(['/']);
        } else {
          window.alert('nieudana próba logowania');
        }
      });
  }
}
