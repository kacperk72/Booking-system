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
} from '@angular/forms';

@Component({
  selector: 'app-add-reservation-modal',
  templateUrl: './add-reservation-modal.component.html',
  styleUrls: ['./add-reservation-modal.component.css'],
})
export class AddReservationModalComponent implements OnInit {
  reservationForm: any;
  constructor(
    public dialogRef: MatDialogRef<AddReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ReservationService,
    private formBuilder: FormBuilder
  ) {
    this.reservationForm = this.formBuilder.group({
      reservations: this.formBuilder.array([]),
    });
    for (let i = 0; i < this.getUniqueDays().length; i++) {
      this.reservationsArray.push(
        this.formBuilder.group({
          endTime: ['', Validators.required],
          mail: ['', Validators.required],
          subjectName: ['', Validators.required],
        })
      );
    }
  }

  get reservationsArray() {
    return this.reservationForm.get('reservations') as FormArray;
  }

  ngOnInit() {
    console.log(this.data);
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservations = this.reservationForm.value.reservations;
      reservations.forEach((reservation: any, index: number) => {
        const day = this.getUniqueDays()[index];
        const slot = this.getSlotsForDay(day)[0]; // Assumes only one slot per day
        const reservationRequest: IReservation = {
          salaId: this.data.SalaId, // Assumes data contains roomId
          mail: reservation.mail,
          course: reservation.subjectName,
          start: day + ' ' + slot.hour,
          end: day + ' ' + reservation.endTime,
          acceptationState: false,
        };
        this.service
          .addReservation(reservationRequest)
          .subscribe((response) => {
            console.log(response);
          });
      });
    }
    this.dialogRef.close();
  }

  getUniqueDays(): string[] {
    return Array.from(new Set(this.data.slots.map((slot: any) => slot.day)));
  }

  getSlotsForDay(day: string): { day: string; hour: string }[] {
    return this.data.slots.filter((slot: any) => slot.day === day);
  }
}
