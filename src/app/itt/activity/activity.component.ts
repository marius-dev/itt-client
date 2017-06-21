import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivityManagerService} from '../../util/activity/activity-manager.service';
import {Observable} from 'rxjs/Observable';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfWeek} from 'date-fns';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import {Subject} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';


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
  styleUrls: ['./activity.component.scss']
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

  events$: Observable<CalendarEvent[]>;


  constructor(private modal: NgbModal,
              private translate: TranslateService,
              private activityService: ActivityManagerService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');
  }

  ngOnInit() {
    const date = startOfWeek(new Date());
    const pr = this.activityService.getActivitiesOnDate(date);
    this.events = Observable.fromPromise(pr)
      .map(res => res.json())
      .map(({results}: { results }) => {
        return results.map((data) => {
          return this.activityService.activityToCalendarObject(data, date);
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

  addEvent(activity: CalendarEvent): void {
    this.events.push(activity);
    this.refresh.next();
  }

  get getCurrntLang() {
    return this.translate.currentLang;
  }

}
