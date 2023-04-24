import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-reservation',
  templateUrl: './admin-add-reservation.component.html',
  styleUrls: ['./admin-add-reservation.component.css'],
})
export class AdminAddReservationComponent {
  formGroup!: FormGroup;
  available: boolean = true;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      subjectName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  closeBooking(): void {
    this.router.navigate(['/dashboard']);
  }

  checkAvailability(): void {}

  bookTerm(): void {
    window.alert('Rezerwacja zakończona sukcesem!');
  }
}
