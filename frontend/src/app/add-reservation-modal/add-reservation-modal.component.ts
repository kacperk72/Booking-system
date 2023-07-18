import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IReservation,
  ReservationService,
} from '../service/reservation.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  Validators,
  ValidatorFn,
} from '@angular/forms';

export function timeValidator(min: string, max: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let time = control.value;
    return time >= min && time <= max
      ? null
      : { timeInvalid: { value: control.value } };
  };
}

@Component({
  selector: 'app-add-reservation-modal',
  templateUrl: './add-reservation-modal.component.html',
  styleUrls: ['./add-reservation-modal.component.css'],
})
export class AddReservationModalComponent implements OnInit {
  reservationForm: any;
  newTime: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ReservationService,
    private formBuilder: FormBuilder
  ) {
    this.reservationForm = this.formBuilder.group({
      reservations: this.formBuilder.array([]),
    });
  }

  get reservationsArray() {
    return this.reservationForm.get('reservations') as FormArray;
  }

  ngOnInit() {
    console.log(this.data);
    const lastSlotIndex = this.data.slots.length - 1;
    this.newTime = this.addHour(this.data.slots[lastSlotIndex].hour);

    console.log(this.newTime);

    for (let i = 0; i < this.getUniqueDays().length; i++) {
      this.reservationsArray.push(
        this.formBuilder.group({
          startTime: [
            this.data.slots[0].hour,
            [
              Validators.required,
              timeValidator(this.data.slots[0].hour, this.newTime),
            ],
          ],
          endTime: [
            this.newTime,
            [
              Validators.required,
              timeValidator(this.data.slots[0].hour, this.newTime),
            ],
          ],
          mail: ['', Validators.required],
          subjectName: ['', Validators.required],
        })
      );
    }
  }

  onSubmit(): void {
    const reservations = this.reservationForm.value.reservations;
    if (this.reservationForm.valid) {
      reservations.forEach((reservation: any, index: number) => {
        const startTime = reservation.startTime;
        const endTime = reservation.endTime;
        const salaId = this.data.SalaId;
        const date = this.data.slots[0].date;
        const mail = reservation.mail;
        const subjectName = reservation.subjectName;
        const dateParts = date.split(' ');
        const day = parseInt(dateParts[0]);
        const monthName = dateParts[1];
        const year = parseInt(dateParts[2]);
        const monthMap: { [key: string]: number } = {
          stycznia: 0,
          lutego: 1,
          marca: 2,
          kwietnia: 3,
          maja: 4,
          czerwca: 5,
          lipca: 6,
          sierpnia: 7,
          września: 8,
          października: 9,
          listopada: 10,
          grudnia: 11,
        };
        const month = monthMap[monthName];
        const isoDate = new Date(year, month, day + 1).toISOString();

        const [hours, minutes] = startTime.split(':');
        const isoTime = `T${hours.padStart(2, '0')}:${minutes.padStart(
          2,
          '0'
        )}:00.000Z`;
        const dateTime = isoDate.substring(0, 10) + isoTime;

        const [hours2, minutes2] = endTime.split(':');
        const isoTime2 = `T${hours2.padStart(2, '0')}:${minutes2.padStart(
          2,
          '0'
        )}:00.000Z`;

        const dateTime2 = isoDate.substring(0, 10) + isoTime2;

        const reservationRequest = {
          salaId: salaId,
          start: dateTime,
          end: dateTime2,
          mail: mail,
          course: subjectName,
          acceptationState: 'pending',
        };

        this.service
          .addReservation(reservationRequest)
          .subscribe((response) => {});
      });
    } else {
      window.alert('Niepoprawne dane');
      return;
    }
    this.dialogRef.close();
    window.alert('Rezerwacja została przekazana do akceptacji przez admina');
  }

  getUniqueDays(): string[] {
    return Array.from(new Set(this.data.slots.map((slot: any) => slot.day)));
  }

  getSlotsForDay(day: string): { day: string; hour: string }[] {
    return this.data.slots.filter((slot: any) => slot.day === day);
  }

  addHour(timeString: string): string {
    let parts = timeString.split(':');
    let date = new Date();
    date.setHours(parseInt(parts[0]), parseInt(parts[1]));
    date.setHours(date.getHours() + 2);

    let newHours = date.getHours().toString().padStart(2, '0');
    let newMinutes = date.getMinutes().toString().padStart(2, '0');

    return `${newHours}:${newMinutes}`;
  }
}
