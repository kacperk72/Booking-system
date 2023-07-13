import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddReservationModalComponent } from '../add-reservation-modal/add-reservation-modal.component';
import { TimetableService } from '../service/timetable.service';

interface Lesson {
  SALA_ID: number;
  NazwaPrzedmiotu: string;
  DataStartu: string;
  DataKonca: string;
  NazwaSali: string;
}

@Component({
  selector: 'app-room-timetable-view',
  templateUrl: './room-timetable-view.component.html',
  styleUrls: ['./room-timetable-view.component.css'],
})
export class RoomTimetableViewComponent implements OnInit, AfterViewInit {
  days = [
    { name: 'Poniedziałek', date: '' },
    { name: 'Wtorek', date: '' },
    { name: 'Środa', date: '' },
    { name: 'Czwartek', date: '' },
    { name: 'Piątek', date: '' },
    { name: 'Sobota', date: '' },
    { name: 'Niedziela', date: '' },
  ];

  hours = Array.from(
    { length: 7 },
    (_, i) => `${(i * 2 + 8).toString().padStart(2, '0')}:00`
  );
  lessons: Lesson[] = [];
  currentWeek: Date[] = [];
  currentMonth: Date[] = [];
  roomName: string = '';
  SalaId: string = '';
  displayedLessons: Lesson[] = [];
  selectedSlots: { [key: string]: boolean } = {};
  isLoadedTimeTable: boolean = false;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private service: TimetableService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.roomName = params['roomName'];
      this.SalaId = params['id'];
    });
    this.setCurrentWeek();
    this.setCurrentMonth();
  }

  ngAfterViewInit(): void {
    let monthNumber = Number(new Date(this.currentMonth[0].getMonth() + 1));
    // API request
    this.service
      .getTimetable(monthNumber, this.SalaId)
      .subscribe((timetable: any) => {
        console.log(timetable);
        this.lessons = timetable;

        this.days.forEach((day, index) => {
          const date = new Date(this.currentWeek[0].getTime());
          date.setDate(date.getDate() + index + 1);
          day.date = this.getFormattedDate(date);
        });

        this.updateLessons();
        this.isLoadedTimeTable = true;
      });
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
    this.displayedLessons = this.lessons.filter((lesson) => {
      const lessonStart = new Date(lesson.DataStartu);
      const lessonEnd = new Date(lesson.DataKonca);

      return (
        lessonStart >= this.currentWeek[0] && lessonEnd <= this.currentWeek[1]
      );
    });
  }

  getLessonInRange(hour: string, day: string) {
    return this.displayedLessons.find((l) => {
      const lessonDay = new Date(l.DataStartu).getDay();
      const lessonHourStart = new Date(l.DataStartu).getHours();
      const lessonHourEnd = new Date(l.DataKonca).getHours();
      const hourNumber = parseInt(hour.split(':')[0]);
      return (
        lessonDay === this.getDayNumber(day) &&
        hourNumber >= lessonHourStart &&
        hourNumber < lessonHourEnd
      );
    });
  }

  getDayNumber(day: string): number {
    const days = [
      'Niedziela',
      'Poniedziałek',
      'Wtorek',
      'Środa',
      'Czwartek',
      'Piątek',
      'Sobota',
    ];
    return days.indexOf(day);
  }

  setCurrentWeek() {
    const currentDate = new Date();
    const firstDayOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);

    console.log(firstDayOfWeek, lastDayOfWeek);

    this.currentWeek = [firstDayOfWeek, lastDayOfWeek];
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

    this.days.forEach((day, index) => {
      const date = new Date(this.currentWeek[0].getTime()); // tworzymy nowy obiekt daty
      date.setDate(date.getDate() + index + 1);
      day.date = this.getFormattedDate(date);
    });

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

    this.days.forEach((day, index) => {
      const date = new Date(this.currentWeek[0].getTime()); // tworzymy nowy obiekt daty
      date.setDate(date.getDate() + index + 1);
      day.date = this.getFormattedDate(date);
    });

    this.updateLessons();
  }

  previousMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() - 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() - 1);
    this.updateLessons();

    let firstDayOfMonth = new Date(
      this.currentMonth[0].getFullYear(),
      this.currentMonth[0].getMonth(),
      1
    );

    let dayOfWeek = firstDayOfMonth.getDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    let diff = dayOfWeek - 1;

    this.currentWeek[0] = new Date(
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - diff)
    );

    this.currentWeek[1] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth(),
      this.currentWeek[0].getDate() + 6
    );

    this.days.forEach((day, index) => {
      const date = new Date(this.currentWeek[0].getTime());
      date.setDate(date.getDate() + index);
      day.date = this.getFormattedDate(date);
    });

    this.updateLessons();

    // Get data for new month
    let monthNumber = Number(new Date(this.currentMonth[0].getMonth() + 1));
    this.service
      .getTimetable(monthNumber, this.SalaId)
      .subscribe((timetable: any) => {
        this.lessons = timetable;
        this.updateLessons();
        this.isLoadedTimeTable = true;
      });
  }

  nextMonth() {
    this.currentMonth[0].setMonth(this.currentMonth[0].getMonth() + 1);
    this.currentMonth[1].setMonth(this.currentMonth[1].getMonth() + 1);
    this.updateLessons();

    let firstDayOfMonth = new Date(
      this.currentMonth[0].getFullYear(),
      this.currentMonth[0].getMonth(),
      1
    );

    let dayOfWeek = firstDayOfMonth.getDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    let diff = dayOfWeek - 1;

    this.currentWeek[0] = new Date(
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - diff)
    );
    this.currentWeek[1] = new Date(
      this.currentWeek[0].getFullYear(),
      this.currentWeek[0].getMonth(),
      this.currentWeek[0].getDate() + 6
    );

    this.days.forEach((day, index) => {
      const date = new Date(this.currentWeek[0].getTime()); // tworzymy nowy obiekt daty
      date.setDate(date.getDate() + index);
      day.date = this.getFormattedDate(date);
    });

    this.updateLessons();
    // Get data for new month
    let monthNumber = Number(new Date(this.currentMonth[0].getMonth() + 1));
    this.service
      .getTimetable(monthNumber, this.SalaId)
      .subscribe((timetable: any) => {
        this.lessons = timetable;
        this.updateLessons();
      });
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
        const [day, date, hour] = key.split('-');
        return { day, date, hour };
      });

    const sortedHours = selected.map((slot) => slot.hour).sort();
    for (let i = 0; i < sortedHours.length - 1; i++) {
      const currentHour = new Date(`2000-01-01T${sortedHours[i]}:00`);
      const nextHour = new Date(`2000-01-01T${sortedHours[i + 1]}:00`);
      const timeDifference = Math.abs(
        nextHour.getTime() - currentHour.getTime()
      );
      const hourDifference = timeDifference / (1000 * 60 * 60); // przerwa w godzinach
      console.log(hourDifference);
      if (hourDifference > 2) {
        alert('Za duża przerwa między rezerwacjami!');
        return;
      }
    }

    if (selected.length === 0) {
      alert('Proszę zaznaczyć co najmniej jeden slot.');
      return;
    }

    const uniqueDates = new Set(selected.map((slot) => slot.date));
    if (uniqueDates.size > 1) {
      alert('Dopuszczamy rezerwację zajęć w jednym dniu.');
      return;
    }

    const dialogRef = this.dialog.open(AddReservationModalComponent, {
      data: { slots: selected, roomName: this.roomName, SalaId: this.SalaId },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.selectedSlots = {};
      location.reload();
    });
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getFormattedTime(isoDate: string): string {
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
}
