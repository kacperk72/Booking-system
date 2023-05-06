import { Component, OnInit } from '@angular/core';

interface TimeSlot {
  hour: string;
  lessons: {
    day: string;
    name: string;
    instructor: string;
    room: string;
    duration: number;
  }[];
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
          hour: '8:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'E-bizes',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-2',
              duration: 2,
            },
          ],
        },
        {
          hour: '9:00',
          lessons: [],
        },
        {
          hour: '10:00',
          lessons: [
            {
              day: 'Wtorek',
              name: 'Analiza',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-1',
              duration: 1,
            },
          ],
        },
        {
          hour: '11:00',
          lessons: [
            {
              day: 'Środa',
              name: 'Programowanie',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-3',
              duration: 3,
            },
          ],
        },
        {
          hour: '12:00',
          lessons: [],
        },
        {
          hour: '13:00',
          lessons: [],
        },
        {
          hour: '14:00',
          lessons: [
            {
              day: 'Czwartek',
              name: 'Matematyka',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-4',
              duration: 2,
            },
          ],
        },
        {
          hour: '15:00',
          lessons: [],
        },
        {
          hour: '16:00',
          lessons: [
            {
              day: 'Piątek',
              name: 'Fizyka',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-5',
              duration: 1,
            },
          ],
        },
        {
          hour: '17:00',
          lessons: [],
        },
        {
          hour: '18:00',
          lessons: [
            {
              day: 'Piątek',
              name: 'Historia',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-6',
              duration: 2,
            },
          ],
        },
        {
          hour: '19:00',
          lessons: [],
        },
      ],
    },
    {
      weekNumber: 2,
      slots: [
        {
          hour: '8:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'E-bizes',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-2',
              duration: 2,
            },
          ],
        },
        {
          hour: '9:00',
          lessons: [],
        },
        {
          hour: '10:00',
          lessons: [],
        },
        {
          hour: '11:00',
          lessons: [],
        },
        {
          hour: '12:00',
          lessons: [],
        },
        {
          hour: '13:00',
          lessons: [],
        },
        {
          hour: '14:00',
          lessons: [],
        },
        {
          hour: '15:00',
          lessons: [],
        },
        {
          hour: '16:00',
          lessons: [],
        },
        {
          hour: '17:00',
          lessons: [],
        },
        {
          hour: '18:00',
          lessons: [],
        },
        {
          hour: '19:00',
          lessons: [],
        },
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
      const startHour = parseInt(slot.hour.split(':')[0]);
      const endHour = startHour + lesson.duration;
      return {
        ...lesson,
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
      };
    }
    return null;
  }

  isInMergedSlot(slot: TimeSlot, day: string) {
    const lesson = this.getLesson(slot, day);
    return lesson && lesson.duration > 1;
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
