import { Component } from '@angular/core';
import { CalendarService } from '../calendar.service';
import { CalendarDate } from '../calendar-date';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css'],
  providers: [CalendarService],
})
export class CalendarPageComponent {
  today: Date = new Date();
  weekDays: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  weeksInMonth: CalendarDate[][] = [];
  month: number;
  year: number;

  constructor(
    private calendarService: CalendarService,
    private router: Router
  ) {
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    this.resetCalendar();
  }

  goToCurrentMonth(): void {
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();
    this.resetCalendar();
  }

  previousMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.resetCalendar();
  }

  nextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.resetCalendar();
  }

  resetCalendar(): void {
    this.weeksInMonth = this.calendarService.getMonth(this.year, this.month);
  }

  get monthName(): string {
    return new Date(this.year, this.month).toLocaleString('en-us', {
      month: 'long',
    });
  }

  isToday(date: CalendarDate): boolean {
    return this.calendarService.isToday(date);
  }

  viewAppointments(date: CalendarDate): void {
    this.router.navigate(['/appointments', date.year, date.month + 1, date.date]);
  }
}
