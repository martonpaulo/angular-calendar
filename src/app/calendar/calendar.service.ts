import { Injectable } from '@angular/core';
import { CalendarDate } from './calendar-date';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  getMonth(year: number, month: number): CalendarDate[][] {
    const weeksInMonth: CalendarDate[][] = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const numberOfDaysInMonth = new Date(year, month + 1, 0).getDate();
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week: CalendarDate[] = [];
      if (i === 0) {
        // add empty days before the first day of the month
        for (let j = 0; j < firstDayOfMonth.getDay(); j++) {
          week.push(new CalendarDate(year, month, -1));
        }
        // add the days of the month
        for (let j = firstDayOfMonth.getDay(); j < 7; j++) {
          week.push(new CalendarDate(year, month, day++));
        }
      } else {
        // add week days
        for (let j = 0; j < 7; j++) {
          if (day <= numberOfDaysInMonth) {
            week.push(new CalendarDate(year, month, day++));
          } else {
            week.push(new CalendarDate(year, month, -1));
          }
        }
      }
      weeksInMonth.push(week);
    }
    return weeksInMonth;
  }

  isToday(date: CalendarDate): boolean {
    const today = new Date();
    return (
      today.getFullYear() === date.year &&
      today.getMonth() === date.month &&
      today.getDate() === date.date
    );
  }
}
