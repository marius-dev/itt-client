import {Component, OnInit, TemplateRef, ViewChild, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
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
  CalendarEvent, CalendarEventTitleFormatter
} from 'angular-calendar';

import {Subject as Sub} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';
import {EventTitleFormatter} from '../activity/event-formatter';
import {ActivityManagerService} from '../activity/activity-manager.service';
import {MetadataUtilService} from '../metadada-util.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subject} from '../calendar-metadata';


@Component({
  selector: 'app-subject-activities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subject-activities.component.html',
  styleUrls: ['./subject-activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: EventTitleFormatter
  }]

})
export class SubjectActivitiesComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'day';
  viewDate: Date = new Date(2017, 4, 22);
  lastViewDate: Date = this.viewDate;
  refresh: Sub<any> = new Sub();
  activeDayIsOpen: boolean = true;
  weekStartsOn: number = 1;
  events$: Observable<any>;

  isSubjectSelected = false;
  filteredSubject: Observable<Subject[]>;
  allSubjects: Observable<Subject[]>;
  selectedSubject: Subject;
  subjectControl: FormControl;

  paramId: number;

  urlSubscription: any;

  modalData: {
    action: string,
    event: CalendarEvent
  };

  constructor(private modal: NgbModal,
              private translate: TranslateService,
              private metadataUtil: MetadataUtilService,
              private route: ActivatedRoute,
              private activityService: ActivityManagerService) {

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'ro');

    this.selectedSubject = new Subject();
    this.subjectControl = new FormControl();

    this.urlSubscription = this.route.params.subscribe(params => {
      this.selectedSubject.id = +params['id'];
      this.paramId = +params['id'];
    });
  }

  filter(name: string): Observable<Subject[]> {
    return this.allSubjects
      .map(subjects => {
        return subjects.filter(
          (subject) => new RegExp(`^${name}`, 'gi').test(subject.fullName)
        );
      });
  }

  ngOnInit() {
    this.loadSubjects();

    this.subjectControl.valueChanges
      .subscribe(
        value => {
          this.selectedSubject = value;
          this.filteredSubject = this.filter(value);
          if (value instanceof Subject) {
            this.updateSubject();
          }
        }
      );
  }


  updateSubject() {
    this.isSubjectSelected = !!(this.selectedSubject instanceof Subject && this.selectedSubject.id && this.selectedSubject.shortName);

    if (this.isSubjectSelected) {
      this.fetchEvents(false);
    }
  }

  loadSubjects() {
    const pr = this.activityService.getAllSubjects();
    this.filteredSubject = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((subject) => {
          return this.metadataUtil.serializedSubjectToMetadata(subject);
        });
      });

    this.allSubjects = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((subject) => {
          const subjectObj = this.metadataUtil.serializedSubjectToMetadata(subject);
          if (subjectObj.id === this.selectedSubject.id && !isNaN(this.paramId)) {
            this.selectedSubject = subjectObj;
            this.paramId = parseFloat('nan');
          }
          return subjectObj;
        });
      });
  }


  fetchEvents(check: boolean = true): void {
    const date = startOfWeek(
      this.viewDate,
      {weekStartsOn: 1}
    );

    const lastViewWeekEndDate = startOfWeek(this.lastViewDate, {weekStartsOn: 1});

    if (
      lastViewWeekEndDate.getDate() === date.getDate() &&
      lastViewWeekEndDate.getMonth() !== date.getMonth() && check) {
      return;
    }

    const pr = this.activityService.getActivitiesForSubjectOnDate(this.selectedSubject.id, date);

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

  subjectDisplayMethod(subject: Subject): string {
    return subject ? subject.fullName : '-';
  }

  goToDay($event) {
    this.viewDate = $event.day.date;
    this.view = 'day';
  }
}
