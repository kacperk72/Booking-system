import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddReservationModalComponent } from '../add-reservation-modal/add-reservation-modal.component';

interface Lesson {
  date: Date;
  day: string;
  name: string;
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-room-timetable-view',
  templateUrl: './room-timetable-view.component.html',
  styleUrls: ['./room-timetable-view.component.css'],
})
export class RoomTimetableViewComponent implements OnInit {
  days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  hours = Array.from(
    { length: 12 },
    (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`
  );
  lessons: Lesson[] = [];
  currentWeek: Date[] = [];
  currentMonth: Date[] = [];
  roomName: string = '';
  SalaId: string = '';
  displayedLessons: Lesson[] = [];
  selectedSlots: { [key: string]: boolean } = {};

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.roomName = params['roomName'];
      this.SalaId = params['id'];
    });

    this.lessons = [
      {
        date: new Date('2023-05-15'),
        day: 'Wtorek',
        name: 'Programowanie w Java',
        instructor: 'Jan Kowalski',
        room: 'Sala 101',
        startTime: '08:00',
        endTime: '11:45',
      },
      {
        date: new Date('2023-05-16'),
        day: 'Poniedziałek',
        name: 'Programowanie w C++',
        instructor: 'Anna Nowak',
        room: 'Sala 101',
        startTime: '09:00',
        endTime: '12:45',
      },
    ];

    this.setCurrentWeek();
    this.setCurrentMonth();
    this.updateLessons();
  }

  isHourInRange(hour: string, start: string, end: string) {
    const [h, m] = hour.split(':').map(Number);
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const minuteOfDay = h * 60 + m;
    const startMinuteOfDay = startH * 60 + startM;
    const endMinuteOfDay = endH * 60 + endM;

    return minuteOfDay >= startMinuteOfDay && minuteOfDay < endMinuteOfDay;
  }

  updateLessons() {
    this.displayedLessons = this.lessons.filter(
      (lesson) =>
        lesson.date >= this.currentWeek[0] && lesson.date <= this.currentWeek[1]
    );
    console.log(this.displayedLessons);
    console.log(this.currentWeek[0]);
    console.log(this.currentWeek[1]);
  }

  getLessonInRange(hour: string, day: string) {
    return this.displayedLessons.find(
      (l) => l.day === day && this.isHourInRange(hour, l.startTime, l.endTime)
    );
  }

  setCurrentWeek() {
    const currentDate = new Date();
    const firstDayOfWeek = currentDate.getDate() - currentDate.getDay();
    const lastDayOfWeek = firstDayOfWeek + 7;

    const startDate = new Date(currentDate.setDate(firstDayOfWeek));
    const endDate = new Date(currentDate.setDate(lastDayOfWeek));

    this.currentWeek = [startDate, endDate];
  }

  previousWeek() {
    this.currentWeek[0] = new Date(
      this.currentWeek[0].setDate(this.currentWeek[0].getDate() - 7)
    );
    this.currentWeek[1] = new Date(
      this.currentWeek[1].setDate(this.currentWeek[1].getDate() - 7)
    );

    if (this.currentWeek[0].getMonth() !== this.currentMonth[0].getMonth()) {
      this.setCurrentMonth();
    }

    this.updateLessons();
  }

  nextWeek() {
    this.currentWeek[0] = new Date(
      this.currentWeek[0].setDate(this.currentWeek[0].getDate() + 7)
    );
    this.currentWeek[1] = new Date(
      this.currentWeek[1].setDate(this.currentWeek[1].getDate() + 7)
    );

    if (this.currentWeek[0].getMonth() !== this.currentMonth[0].getMonth()) {
      this.setCurrentMonth();
    }

    this.updateLessons();
  }

  previousMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() - 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() - 1);
    this.updateLessons();

    this.currentWeek[0] = new Date(
      this.currentMonth[0].getFullYear(),
      this.currentMonth[0].getMonth(),
      1
    );
    this.currentWeek[1] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth(),
      this.currentWeek[0].getDate() + 6
    );
  }

  nextMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() + 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() + 1);
    this.updateLessons();

    this.currentWeek[0] = new Date(
      this.currentMonth[0].getFullYear(),
      this.currentMonth[0].getMonth(),
      1
    );
    this.currentWeek[1] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth(),
      this.currentWeek[0].getDate() + 6
    );
  }

  setCurrentMonth() {
    this.currentMonth[0] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth(),
      1
    );
    this.currentMonth[1] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth() + 1,
      0
    );
  }

  printSchedule() {
    window.print();
  }

  openModal() {
    const selected = Object.keys(this.selectedSlots)
      .filter((key) => this.selectedSlots[key])
      .map((key) => {
        const [day, hour] = key.split('-');
        return { day, hour };
      });

    if (selected.length === 0) {
      alert('Proszę zaznaczyć co najmniej jeden slot.');
      return;
    }

    const dialogRef = this.dialog.open(AddReservationModalComponent, {
      data: { slots: selected, roomName: this.roomName, SalaId: this.SalaId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.selectedSlots = {};
    });
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
