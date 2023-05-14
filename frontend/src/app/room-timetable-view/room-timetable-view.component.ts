import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddReservationModalComponent } from '../add-reservation-modal/add-reservation-modal.component';

interface Lesson {
  day: string;
  name: string;
  instructor: string;
  room: string;
  startTime: string;
  endTime: string;
}

interface WeeklySchedule {
  weekNumber: number;
  lessons: Lesson[];
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
  yearlySchedule: WeeklySchedule[] = [];
  lessons: Lesson[] = [];
  currentWeek = 1;
  currentMonth = 1;
  roomName: string = '';

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.roomName = params['roomName'];
    });

    this.yearlySchedule = [
      {
        weekNumber: 1,
        lessons: [
          {
            day: 'Poniedziałek',
            name: 'Programowanie w Java',
            instructor: 'Jan Kowalski',
            room: 'Sala 101',
            startTime: '08:00',
            endTime: '11:45',
          },
        ],
      },
      {
        weekNumber: 2,
        lessons: [
          {
            day: 'Poniedziałek',
            name: 'Programowanie w Java',
            instructor: 'Jan Kowalski',
            room: 'Sala 101',
            startTime: '09:00',
            endTime: '12:45',
          },
        ],
      },
    ];
    this.updateLessons();
  }

  getLessonInRange(hour: string, day: string) {
    return this.lessons.find(
      (l) => l.day === day && this.isHourInRange(hour, l.startTime, l.endTime)
    );
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
    const schedule = this.yearlySchedule.find(
      (s) => s.weekNumber === this.currentWeek
    );
    if (schedule) {
      this.lessons = schedule.lessons;
    } else {
      this.lessons = [];
    }
  }

  previousWeek() {
    if (this.currentWeek > 1) {
      this.currentWeek -= 1;
      this.updateLessons();
    }
  }

  nextWeek() {
    if (this.currentWeek < this.yearlySchedule.length) {
      this.currentWeek += 1;
      this.updateLessons();
    }
  }

  previousMonth() {
    if (this.currentMonth > 1) {
      this.currentMonth -= 1;
      this.updateLessons();
    }
  }

  nextMonth() {
    if (this.currentMonth < 12) {
      // Zakładamy, że mamy 12 miesięcy
      this.currentMonth += 1;
      this.updateLessons();
    }
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
