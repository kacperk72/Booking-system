import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @Output() dateSelected = new EventEmitter<Date>();

  selected: Date | null | undefined;

  onDateChange(date: Date) {
    this.selected = date;
    this.dateSelected.emit(this.selected);
  }
}
