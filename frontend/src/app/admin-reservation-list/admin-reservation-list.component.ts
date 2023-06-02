import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';

export interface PeriodicElement {
  id: string;
  mail: string;
  room: string;
  date: string;
  hour: string;
}

const mockData: PeriodicElement[] = [];

@Component({
  selector: 'app-admin-reservation-list',
  templateUrl: './admin-reservation-list.component.html',
  styleUrls: ['./admin-reservation-list.component.css'],
})
export class AdminReservationListComponent implements OnInit {
  dataSource = mockData;
  displayedColumns: string[] = ['id', 'mail', 'room', 'date', 'hour', 'icons'];
  isLoading: boolean = true;

  constructor(private service: AdminService) {}

  ngOnInit(): void {
    this.service.getReservations().subscribe((data: any[]) => {
      data = data.filter((el) => el.Potwierdzenie === 'waiting');
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
      this.isLoading = false;
    });
  }

  approveRes(element: any): void {
    this.service.approveReservation(element.id).subscribe(() => {});
    location.reload();
  }

  deleteRes(element: any) {
    this.service.deleteReservation(element.id).subscribe(() => {});
    location.reload();
  }
}
