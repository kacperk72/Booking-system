import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-admin-room-list',
  templateUrl: './admin-room-list.component.html',
  styleUrls: ['./admin-room-list.component.css'],
})
export class AdminRoomListComponent {
  typesOfClasses: string[] = [
    'Sala D-1-01',
    'Sala E-1-02',
    'Sala F-1-03',
    'Sala H-1-04',
    'Sala A-1-05',
    'Sala D-1-01',
    'Sala E-1-02',
    'Sala F-1-03',
    'Sala H-1-04',
    'Sala A-1-05',
    'Sala D-1-01',
    'Sala E-1-02',
    'Sala F-1-03',
    'Sala H-1-04',
    'Sala A-1-05',
    'Sala D-1-01',
    'Sala E-1-02',
    'Sala F-1-03',
    'Sala H-1-04',
    'Sala A-1-05',
  ];

  @Output()
  public reservationButton = new EventEmitter<MouseEvent>();
  @Output()
  public chosenClass = new EventEmitter<string>();

  public setReservation(event: MouseEvent) {
    this.reservationButton.emit(event);
  }

  public setChosenClass(value: string) {
    this.chosenClass.emit(value);
  }
}
