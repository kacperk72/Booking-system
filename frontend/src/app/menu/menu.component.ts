import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  role = '';

  private subEvent$!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.subEvent$ = this.router.events.subscribe((val) => {
      this.role = localStorage.getItem('rola') || '';
    });
  }

  ngOnDestroy(): void {
    if (this.subEvent$) {
      this.subEvent$.unsubscribe();
    }
  }
}
