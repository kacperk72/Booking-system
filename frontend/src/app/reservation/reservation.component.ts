import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ReservationData {
  id: string;
  roomName: string;
  numberOfSeats: number;
  roomType: string;
  date: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent {
  @Output()
  public cancelReser = new EventEmitter<MouseEvent>();
  @Input()
  reservationData!: Array<ReservationData>;

  reservationDataLoaded: boolean = false;
  formGroup!: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      subjectName: new FormControl('', [Validators.required]),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reservationData'] && changes['reservationData'].currentValue) {
      console.log('Received reservation data:', this.reservationData);
      this.reservationDataLoaded = true;
    }
  }

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
