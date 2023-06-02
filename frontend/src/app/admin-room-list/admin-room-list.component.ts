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

  typesOfClasses: any = [];
  reservationVisible: boolean = false;
  reservationData: any;

  constructor(private router: Router, private service: AdminService) {}

  ngOnInit(): void {
    this.service.getRooms().subscribe((rooms) => {
      rooms.forEach((room: any) => {
        const name = room.NazwaSali;
        const id = room.SalaID;
        const obj = { id, name };
        this.typesOfClasses.push(obj);
      });
    });
  }

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

  checkTimetable(room: any): void {
    this.router.navigate(['/room', room.name, room.id]);
  }
}
