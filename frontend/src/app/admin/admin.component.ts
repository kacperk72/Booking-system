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
  {
    id: '3',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-3-12',
    date: '22-03-2023',
    hour: '10:00',
  },
  {
    id: '4',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-4-12',
    date: '24-03-2023',
    hour: '7:00',
  },
  {
    id: '5',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-5-12',
    date: '22-03-2023',
    hour: '10:00',
  },
  {
    id: '6',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-6-12',
    date: '24-03-2023',
    hour: '7:00',
  },
  {
    id: '7',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-7-12',
    date: '22-03-2023',
    hour: '10:00',
  },
  {
    id: '8',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-8-12',
    date: '24-03-2023',
    hour: '7:00',
  },
  {
    id: '9',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-9-12',
    date: '22-03-2023',
    hour: '10:00',
  },
  {
    id: '10',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-10-12',
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
  displayedColumns: string[] = ['id', 'mail', 'room', 'date', 'hour', 'icons'];
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

  approveRes(element: any): void {}

  deleteRes(element: any): void {}

  setReservation($event: MouseEvent) {}

  setChosenClass(value: string) {}
}
