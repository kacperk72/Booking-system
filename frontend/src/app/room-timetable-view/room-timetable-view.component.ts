import { Component } from '@angular/core';

interface TimeSlot {
  hour: string;
  lessons: {
    day: string;
    name: string;
    instructor: string;
    room: string;
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
export class RoomTimetableViewComponent {
  days = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
  yearlySchedule: WeeklySchedule[] = [
    {
      weekNumber: 1,
      slots: [
        {
          hour: '8:00 - 10:00',
          lessons: [
            {
              day: 'Poniedziałek',
              name: 'E-bizes',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-2',
            },
            // Dodaj pozostałe zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '10:00 - 12:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '12:00 - 14:00',
          lessons: [
            {
              day: 'Środa',
              name: 'Analiza',
              instructor: 'Jan Kowalski',
              room: 'Sala A-2-1',
            },
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '14:00 - 16:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '16:00 - 18:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '18:00 - 20:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      slots: [
        {
          hour: '8:00 - 10:00',
          lessons: [
            {
              day: 'Wtorek',
              name: 'E-bizes',
              instructor: 'Jan Kowalski',
              room: 'Sala 101',
            },
            // Dodaj pozostałe zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '10:00 - 12:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '12:00 - 14:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '14:00 - 16:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '16:00 - 18:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
        {
          hour: '18:00 - 20:00',
          lessons: [
            // Dodaj zajęcia dla tego przedziału godzinowego
          ],
        },
      ],
    },
  ];
  currentWeek = 1;

  get slots(): TimeSlot[] {
    const schedule = this.yearlySchedule.find(
      (s) => s.weekNumber === this.currentWeek
    );
    return schedule ? schedule.slots : [];
  }

  getLesson(slot: TimeSlot, day: string) {
    return slot.lessons.find((l) => l.day === day);
  }

  printSchedule() {
    window.print();
  }

  previousWeek() {
    if (this.currentWeek > 1) {
      this.currentWeek -= 1;
    }
  }

  nextWeek() {
    if (this.currentWeek < this.yearlySchedule.length) {
      this.currentWeek += 1;
    }
  }
}
