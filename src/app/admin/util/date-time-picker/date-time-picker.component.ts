import {Component, Input, Output, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import {
  getSeconds,
  getMinutes,
  getHours,
  getDate,
  getMonth,
  getYear,
  setSeconds,
  setMinutes,
  setHours,
  setDate,
  setMonth,
  setYear
} from 'date-fns';

import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss']
})
export class DateTimePickerComponent implements OnChanges {

  @Input() placeholder: string;

  @Input() date: Date;

  @Output() dateChange: EventEmitter<Date> = new EventEmitter();

  dateStruct: NgbDateStruct;

  timeStruct: NgbTimeStruct;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      this.dateStruct = {
        day: getDate(this.date),
        month: getMonth(this.date) + 1,
        year: getYear(this.date)
      };
      this.timeStruct = {
        second: getSeconds(this.date),
        minute: getMinutes(this.date),
        hour: getHours(this.date)
      };
    }
  }

  updateDate(): void {
    const newDate: Date = setYear(setMonth(setDate(this.date, this.dateStruct.day), this.dateStruct.month - 1), this.dateStruct.year);
    this.dateChange.next(newDate);
  }

  updateTime(): void {
    const newDate: Date = setHours(setMinutes(setSeconds(this.date, this.timeStruct.second), this.timeStruct.minute), this.timeStruct.hour);
    this.dateChange.next(newDate);
  }

}
