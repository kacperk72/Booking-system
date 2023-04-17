import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent {
  @Output()
  public cancelReser = new EventEmitter<MouseEvent>();

  public cancelReservation() {
    this.cancelReser.emit();
  }

  confirmTerm(): void {
    window.alert('potwierdzono');
  }

  closeBooking(): void {
    this.cancelReservation();
  }

  bookTerm(): void {
    window.alert('Rezerwacja zakończona sukcesem!');
  }
}
