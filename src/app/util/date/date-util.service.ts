import {Injectable} from '@angular/core';

@Injectable()
export class DateUtilService {

  constructor() {
  }

  getFirstDateOfTheWeek(date: Date) {
    const day = date.getDay() || 7;
    if (day !== 1) {
      date.setHours(-24 * (day - 1));
    }
    return date;
  }

  firstDayOfTheWeek(date: Date) {
    return new Date(date.setDate(date.getDate() - date.getDay()));
  }


  lastDayOfTheWeek(date: Date) {
    return new Date(date.setDate(date.getDate() - date.getDay() + 6));
  }

  fistDayOfTheWeekWithOffset(date: Date, offset = 1) {
    const newDate = this.firstDayOfTheWeek(date);
    newDate.setDate(newDate.getDate() - (7 * offset));
    return newDate;
  }

  lastDayOfTheWeekWithOffset(date: Date, offset = 1) {
    const newDate = this.lastDayOfTheWeek(date);
    newDate.setDate(newDate.getDate() - (7 * offset));
    return newDate;
  }
}
