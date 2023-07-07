import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  role = '';

  private subEvent$!: Subscription;

  constructor(private router: Router, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.subEvent$ = this.router.events.subscribe((val) => {
      this.role = this.cookieService.get('rola') || '';
    });
  }

  ngOnDestroy(): void {
    if (this.subEvent$) {
      this.subEvent$.unsubscribe();
    }
  }

  logout() {
    this.cookieService.delete('rola');
    // location.reload();
    this.router.navigate(['/dashboard']);
  }
}
