import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  isLoaded = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  addReservationDB(): void {}

  setReservation($event: MouseEvent) {}

  setChosenClass(value: string) {}
}
