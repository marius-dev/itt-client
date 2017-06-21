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
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarDateFormatter
} from 'angular-calendar';

import {Subject} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';
import {MainDateFormatter} from "./date-formatter.provider";


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./activity.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: MainDateFormatter
  }]
})
export class ActivityComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'day';

  viewDate: Date = new Date();

  modalData: {
    action: string,
    event: CalendarEvent
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

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
    this.fetchEvents();
  }

  fetchEvents(): void {

    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    // if (isSameWeek(date, this.viewDate)) {
    //
    // }

    const tmpDate = new Date();
    const date = startOfWeek(
      new Date(tmpDate.getTime() + tmpDate.getTimezoneOffset() * 60000),
      {weekStartsOn: 1}
    );
    this.viewDate = date;

    const pr = this.activityService.getActivitiesOnDate(date);
    this.events$ = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((activity) => {
          return this.activityService.activityToCalendarObject(activity, date)
        })
      });
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

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

  addEvent(activity: CalendarEvent): void {
    this.events.push(activity);
    this.refresh.next();
  }

  get getCurrntLang() {
    return this.translate.currentLang;
  }

}
