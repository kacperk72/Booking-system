import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-room-list',
  templateUrl: './admin-room-list.component.html',
  styleUrls: ['./admin-room-list.component.css'],
})
export class AdminRoomListComponent {
  @Output()
  public reservationButton = new EventEmitter<MouseEvent>();
  @Output()
  public chosenClass = new EventEmitter<string>();

  constructor(private router: Router) {}

  typesOfClasses: string[] = [
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
    'A-1-05',
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
    'A-1-05',
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
    'A-1-05',
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
    'A-1-05',
  ];
  reservationVisible: boolean = false;
  reservationData: any;

  public setReservation(event: MouseEvent) {
    this.reservationButton.emit(event);
  }

  public setChosenClass(value: string) {
    this.chosenClass.emit(value);
  }

  addReservation(): void {
    this.reservationVisible = true;
  }

  cancelReservation() {
    this.reservationVisible = !this.reservationVisible;
  }

  checkTimetable(room: string): void {
    this.router.navigate(['/room']);
  }
}
