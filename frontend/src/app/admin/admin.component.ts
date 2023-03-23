import { Component } from '@angular/core';

export interface PeriodicElement {
  id: string;
  mail: string;
  room: string;
  date: string;
  hour: string;
}

const mockData: PeriodicElement[] = [
  {
    id: '1',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-1-2',
    date: '22-03-2023',
    hour: '10:00',
  },
  {
    id: '2',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-2-12',
    date: '24-03-2023',
    hour: '7:00',
  },
];

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  displayedColumns: string[] = ['id', 'mail', 'room', 'date', 'hour'];
  isVisibleAdd = true;
  isLoaded = true;
  dataSource = mockData;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  addReservation(): void {
    this.isVisibleAdd = !this.isVisibleAdd;
  }

  addReservationDB(): void {}

  openEditPanel(element: any): void {}

  deleteDoctor(element: any): void {}
}
