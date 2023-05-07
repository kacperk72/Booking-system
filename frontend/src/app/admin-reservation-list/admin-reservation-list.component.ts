import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

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
  // {
  //   id: '8',
  //   mail: 'adam.kowalski@gmail.com',
  //   room: 'A-8-12',
  //   date: '24-05-2023',
  //   hour: '7:00',
  // },
  // {
  //   id: '9',
  //   mail: 'jan.kowalski@gmail.com',
  //   room: 'A-9-12',
  //   date: '22-03-2023',
  //   hour: '10:00',
  // },
  // {
  //   id: '10',
  //   mail: 'adam.kowalski@gmail.com',
  //   room: 'A-10-12',
  //   date: '14-05-2023',
  //   hour: '7:00',
  // },
  // {
  //   id: '11',
  //   mail: 'jan.kowalski@gmail.com',
  //   room: 'A-9-13',
  //   date: '05-05-2023',
  //   hour: '12:00',
  // },
  // {
  //   id: '12',
  //   mail: 'adam.kowalski@gmail.com',
  //   room: 'A-10-14',
  //   date: '06-05-2023',
  //   hour: '8:00',
  // },
];

@Component({
  selector: 'app-admin-reservation-list',
  templateUrl: './admin-reservation-list.component.html',
  styleUrls: ['./admin-reservation-list.component.css'],
})
export class AdminReservationListComponent implements OnInit {
  dataSource = mockData;
  displayedColumns: string[] = ['id', 'mail', 'room', 'date', 'hour', 'icons'];

  constructor(private service: AdminService) {}

  ngOnInit(): void {
    this.service.getReservations().subscribe((data: any[]) => {
      this.dataSource = data.map((reservation) => ({
        id: reservation.RezerwacjaID,
        mail: reservation.Mail,
        room: reservation.SALA_ID,
        date: new Date(reservation.DataStartu).toLocaleDateString(),
        hour:
          new Date(reservation.DataStartu).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }) +
          ' - ' +
          new Date(reservation.DataKonca).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
      }));
    });
  }

  approveRes(element: any): void {
    // wyślij rezerwacje do bazy
    this.dataSource = mockData.filter((item) => item.id !== element.id);
  }

  deleteRes(element: any): void {
    window.alert('Rezerwacja odrzucona');
    // wyślij usunięcie rezerwacji do bazy
  }
}
