import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-time-picker-modal',
  templateUrl: './time-picker-modal.component.html',
  styleUrls: ['./time-picker-modal.component.css'],
})
export class TimePickerModalComponent {
  constructor(public dialogRef: MatDialogRef<TimePickerModalComponent>) {}

  onSubmit(): void {
    // Add your logic here
    this.dialogRef.close();
  }
}
