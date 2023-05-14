import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-reservation-modal',
  templateUrl: './add-reservation-modal.component.html',
  styleUrls: ['./add-reservation-modal.component.css'],
})
export class AddReservationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<AddReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit(): void {
    // Add your logic here
    this.dialogRef.close();
  }
}
