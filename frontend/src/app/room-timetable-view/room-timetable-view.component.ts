import { Component, OnInit } from '@angular/core';

interface Lesson {
  day: string;
  name: string;
  instructor: string;
  room: string;
  startTime: string; // dodajemy startTime
  endTime: string; // dodajemy endTime
}

interface TimeSlot {
  hour: string;
  lessons: Lesson[];
}

interface WeeklySchedule {
  weekNumber: number;
  slots: TimeSlot[];
}
@Component({
  selector: 'app-room-timetable-view',
  templateUrl: './room-timetable-view.component.html',
  styleUrls: ['./room-timetable-view.component.css'],
})
export class RoomTimetableViewComponent implements OnInit {
  days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  yearlySchedule: WeeklySchedule[] = [
    {
      weekNumber: 1,
      slots: [
        {
          hour: '08:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'Programowanie w Java',
              instructor: 'Jan Kowalski',
              room: 'Sala 101',
              startTime: '08:15',
              endTime: '09:45',
            },
            {
              day: 'Wtorek',
              name: 'Architektura Komputerów',
              instructor: 'Anna Nowak',
              room: 'Sala 102',
              startTime: '08:00',
              endTime: '09:30',
            },
          ],
        },
        {
          hour: '10:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'Analiza matematyczna',
              instructor: 'Piotr Wiśniewski',
              room: 'Sala 103',
              startTime: '10:15',
              endTime: '11:45',
            },
          ],
        },
        {
          hour: '12:00',
          lessons: [],
        },
        {
          hour: '14:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'Analiza matematyczna',
              instructor: 'Piotr Wiśniewski',
              room: 'Sala 103',
              startTime: '14:30',
              endTime: '16:00',
            },
          ],
        },
        {
          hour: '16:00',
          lessons: [
            {
              day: 'Środa',
              name: 'Analiza matematyczna',
              instructor: 'Piotr Wiśniewski',
              room: 'Sala 103',
              startTime: '16:00',
              endTime: '20:00',
            },
          ],
        },
        {
          hour: '18:00',
          lessons: [],
        },
        // dodaj więcej slotów czasowych według potrzeb
      ],
    },
  ];

  ngOnInit() {
    this.updateSlots();
  }

  currentWeek = 1;
  slots: TimeSlot[] = [];

  getLesson(slot: TimeSlot, day: string) {
    const lesson = slot.lessons.find((l) => l.day === day);
    if (lesson) {
      return {
        ...lesson,
      };
    }
    return null;
  }

  printSchedule() {
    window.print();
  }

  updateSlots() {
    const schedule = this.yearlySchedule.find(
      (s) => s.weekNumber === this.currentWeek
    );
    if (schedule) {
      this.slots = schedule.slots;
    } else {
      this.slots = [];
    }
  }

  previousWeek() {
    if (this.currentWeek > 1) {
      this.currentWeek -= 1;
      this.updateSlots();
    }
  }

  nextWeek() {
    if (this.currentWeek < this.yearlySchedule.length) {
      this.currentWeek += 1;
      this.updateSlots();
    }
  }
}
