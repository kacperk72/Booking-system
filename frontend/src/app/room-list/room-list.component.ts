import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  typesOfClasses: string[] = [
    'Sala A-1-01',
    'Sala A-1-02',
    'Sala A-1-03',
    'Sala A-1-04',
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
