import { Component } from '@angular/core';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  typesOfShoes: string[] = [
    'Sala A-1-01',
    'Sala A-1-02',
    'Sala A-1-03',
    'Sala A-1-04',
    'Sala A-1-05',
  ];
}
