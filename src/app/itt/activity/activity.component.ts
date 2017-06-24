import {Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ActivityManagerService} from './activity-manager.service';
import {Observable} from 'rxjs/Observable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  isSameWeek
} from 'date-fns';

import {
  CalendarEvent
} from 'angular-calendar';

import {Subject} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';
import {MainDateFormatter} from './date-formatter.provider';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'day';

  viewDate: Date = new Date(2017, 4, 22);

  lastViewDate: Date = this.viewDate;

  modalData: {
    action: string,
    event: CalendarEvent
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = true;

  weekStartsOn: number = 1;

  events$: Observable<any>;

  constructor(private modal: NgbModal,
              private translate: TranslateService,
              private activityService: ActivityManagerService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.fetchEvents(false);
  }

  fetchEvents(check: boolean = true): void {

    console.log(this.viewDate);
    const date = startOfWeek(
      this.viewDate,
      {weekStartsOn: 1}
    );

    if (
      (startOfWeek(this.lastViewDate, {weekStartsOn: 1}).getDay() === date.getDate()) &&
      (startOfWeek(this.lastViewDate, {weekStartsOn: 1}).getMonth() !== date.getMonth()) && check) {
      return;
    }

    const pr = this.activityService.getActivitiesOnDate(date);

    this.events$ = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((activity) => {
          this.lastViewDate = this.viewDate;
          return this.activityService.activityToCalendarObject(activity, date);
        });
      });
  }

  dayClicked({date, events}: { date: Date, events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event, action};
    this.modal.open(this.modalContent, {size: 'lg'});
  }

  get getCurrntLang() {
    return this.translate.currentLang;
  }

}
