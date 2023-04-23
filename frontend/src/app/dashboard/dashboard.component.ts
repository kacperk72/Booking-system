import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  isReservationVisible = false;
  chosenClass = '';
  reservationData: any;
  selectedDate!: Date;

  setReservation(data: any) {
    this.isReservationVisible = !this.isReservationVisible;
    this.reservationData = data;
  }

  cancelReservation() {
    this.isReservationVisible = !this.isReservationVisible;
  }

  setChosenClass(value: string) {
    this.chosenClass = value;
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
  }
}
