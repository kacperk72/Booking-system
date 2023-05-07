import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../service/admin.service';

@Component({
  selector: 'app-admin-room-list',
  templateUrl: './admin-room-list.component.html',
  styleUrls: ['./admin-room-list.component.css'],
})
export class AdminRoomListComponent implements OnInit {
  @Output()
  public reservationButton = new EventEmitter<MouseEvent>();
  @Output()
  public chosenClass = new EventEmitter<string>();

  constructor(private router: Router, private service: AdminService) {}

  ngOnInit(): void {
    this.service.getRooms().subscribe((rooms) => {
      rooms.forEach((room: any) => {
        this.typesOfClasses.push(room.NazwaSali);
      });
    });
  }

  typesOfClasses: string[] = [
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
    'A-1-05',
    'D-1-01',
    'E-1-02',
    'F-1-03',
    'H-1-04',
  ];
  reservationVisible: boolean = false;
  reservationData: any;

  public setReservation(event: MouseEvent) {
    this.reservationButton.emit(event);
  }

  public setChosenClass(value: string) {
    this.chosenClass.emit(value);
  }

  addReservation(): void {
    this.reservationVisible = true;
  }

  cancelReservation() {
    this.reservationVisible = !this.reservationVisible;
  }

  checkTimetable(room: string): void {
    this.router.navigate(['/room']);
  }
}
