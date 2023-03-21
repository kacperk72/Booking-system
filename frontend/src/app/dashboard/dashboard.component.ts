import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isReservationVisible = false;
  chosenClass = '';
  

  setReservation($event: MouseEvent) {
    this.isReservationVisible = !this.isReservationVisible;
  }

  cancelReservation() {
    this.isReservationVisible = !this.isReservationVisible;
  }

  setChosenClass(value: string){
    this.chosenClass = value;
  }

}
