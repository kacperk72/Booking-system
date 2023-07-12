import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

export interface Item {
  existingData: {
    DataKonca: string;
    DataStartu: string;
    Mail: string;
    NazwaPrzedmiotu: string;
    Potwierdzenie: string;
    RezerwacjaID: number;
    SALA_ID: number;
  };
  newItem: {
    DataKonca: string;
    DataStartu: string;
    Mail: string;
    NazwaPrzedmiotu: string;
    Potwierdzenie: string;
    SALA_ID: number;
  };
}

@Component({
  selector: 'app-admin-add-reservation',
  templateUrl: './admin-add-reservation.component.html',
  styleUrls: ['./admin-add-reservation.component.css'],
})
export class AdminAddReservationComponent {
  formGroup!: FormGroup;
  available: boolean = true;
  isLoading: boolean = false;
  conflicts: Item[] = [];
  selectedItems: Item[] = [];
  isLoadedTable: boolean = false;
  firstImport: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AdminService
  ) {
    this.firstImport = JSON.parse(
      localStorage.getItem('firstImport') || 'true'
    );
  }

  ngOnInit(): void {
    console.log('init');

    this.formGroup = this.fb.group({
      email: ['', Validators.required],
      subjectName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      date: ['', Validators.required],
    });

    this.isLoadedTable = false;
    this.service.getConflicts().subscribe((res) => {
      console.log(res);
      this.conflicts = res;
      if (res.length > 0) {
        this.isLoadedTable = true;
      }
    });
  }

  closeBooking(): void {
    this.router.navigate(['/dashboard']);
  }

  checkAvailability(): void {}

  bookTerm(): void {
    this.service.setReservation(this.formGroup.value).subscribe(() => {
      window.alert('Dodano rezerwację!');
    });
  }

  reimport() {
    this.isLoading = true;
    this.firstImport = false;
    this.isLoadedTable = false;
    this.service.reimport().subscribe((res) => {
      console.log(res);
      this.conflicts = res;
      this.isLoading = false;
      if (res.length > 0) {
        this.isLoadedTable = true;
      }
      window.alert('Dane zostały zaimportowane');
    });
  }

  selectItemExisting(item: any, fullItem: any): void {
    this.service.approveReservation(item.RezerwacjaID).subscribe(() => {});
    const index = this.conflicts.indexOf(fullItem);
    if (index > -1) {
      this.conflicts.splice(index, 1);
    }
  }

  selectItemNew(item: any, fullItem: any) {
    this.service.setReservationConflicts(item).subscribe(() => {});
    const index = this.conflicts.indexOf(fullItem);
    if (index > -1) {
      this.conflicts.splice(index, 1);
    }
  }

  firstImportF() {
    this.isLoading = true;
    this.service.firstImportF().subscribe((res) => {});
    setTimeout(() => {
      this.isLoading = false;
      this.firstImport = false;
      localStorage.setItem('firstImport', JSON.stringify(this.firstImport));
      window.alert('Dane dodane do bazy');
    }, 5000);
  }
}
