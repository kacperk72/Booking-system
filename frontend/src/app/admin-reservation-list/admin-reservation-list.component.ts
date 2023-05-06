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
    date: '22-05-2023',
    hour: '10:00',
  },
  {
    id: '2',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-2-12',
    date: '24-05-2023',
    hour: '7:00',
  },
  {
    id: '3',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-3-12',
    date: '22-05-2023',
    hour: '10:00',
  },
  {
    id: '4',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-4-12',
    date: '24-05-2023',
    hour: '7:00',
  },
  {
    id: '5',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-5-12',
    date: '22-05-2023',
    hour: '10:00',
  },
  {
    id: '6',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-6-12',
    date: '24-05-2023',
    hour: '7:00',
  },
  {
    id: '7',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-7-12',
    date: '22-05-2023',
    hour: '10:00',
  },
  {
    id: '8',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-8-12',
    date: '24-05-2023',
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
    date: '14-05-2023',
    hour: '7:00',
  },
  {
    id: '11',
    mail: 'jan.kowalski@gmail.com',
    room: 'A-9-13',
    date: '05-05-2023',
    hour: '12:00',
  },
  {
    id: '12',
    mail: 'adam.kowalski@gmail.com',
    room: 'A-10-14',
    date: '06-05-2023',
    hour: '8:00',
  },
];

@Component({
  selector: 'app-admin-reservation-list',
  templateUrl: './admin-reservation-list.component.html',
  styleUrls: ['./admin-reservation-list.component.css'],
})
export class AdminReservationListComponent {
  dataSource = mockData;
  displayedColumns: string[] = ['id', 'mail', 'room', 'date', 'hour', 'icons'];

  approveRes(element: any): void {
    // wyślij rezerwacje do bazy
    this.dataSource = mockData.filter((item) => item.id !== element.id);
  }

  deleteRes(element: any): void {
    window.alert('Rezerwacja odrzucona');
    // wyślij usunięcie rezerwacji do bazy
  }
}
