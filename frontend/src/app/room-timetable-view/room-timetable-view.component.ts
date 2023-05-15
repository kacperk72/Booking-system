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
  displayedLessons: Lesson[] = [];



  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.roomName = params['roomName'];
    });

    this.lessons = [
      {
        date: new Date('2023-05-15'),
        day: 'Poniedziałek',
        name: 'Programowanie w Java',
        instructor: 'Jan Kowalski',
        room: 'Sala 101',
        startTime: '08:00',
        endTime: '11:45',
      },
      {
        date: new Date('2023-05-16'),
        day: 'Wtorek',
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
      lesson => lesson.date >= this.currentWeek[0] && lesson.date <= this.currentWeek[1]
    );
  }
  
  getLessonInRange(hour: string, day: string) {
    return this.displayedLessons.find(
      (l) => l.day === day && this.isHourInRange(hour, l.startTime, l.endTime)
    );
  }

  setCurrentWeek() {
    const currentDate = new Date();
    const firstDayOfWeek = currentDate.getDate() - currentDate.getDay() + 1;
    const lastDayOfWeek = firstDayOfWeek + 6;

    const startDate = new Date(currentDate.setDate(firstDayOfWeek));
    const endDate = new Date(currentDate.setDate(lastDayOfWeek));

    this.currentWeek = [startDate, endDate];
  }

  previousWeek() {
    this.currentWeek[0].setDate(this.currentWeek[0].getDate() - 7);
    this.currentWeek[1].setDate(this.currentWeek[1].getDate() - 7);
    this.updateLessons();
  }

  nextWeek() {
    this.currentWeek[0].setDate(this.currentWeek[0].getDate() + 7);
    this.currentWeek[1].setDate(this.currentWeek[1].getDate() + 7);
    this.updateLessons();
  }
  
  setCurrentMonth() {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    this.currentMonth = [startDate, endDate];
  }
  
  previousMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() - 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() - 1);
    this.updateLessons();
  }
  
  nextMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() + 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() + 1);
    this.updateLessons();
  }
  
  printSchedule() {
    window.print();
  }
  
  openModal(day: string, hour: string) {
    const name = this.roomName;
    const dialogRef = this.dialog.open(AddReservationModalComponent, {
      data: { day, hour, name },
    });
  }
  }
  