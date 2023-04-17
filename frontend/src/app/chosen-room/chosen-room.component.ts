import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chosen-room',
  templateUrl: './chosen-room.component.html',
  styleUrls: ['./chosen-room.component.css'],
})
export class ChosenRoomComponent {
  @Input() data: string = '';
}
