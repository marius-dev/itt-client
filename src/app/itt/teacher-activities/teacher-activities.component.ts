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
import {Teacher} from '../calendar-metadata';


@Component({
  selector: 'app-teacher-activities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './teacher-activities.component.html',
  styleUrls: ['./teacher-activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: EventTitleFormatter
  }]

})
export class TeacherActivitiesComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'day';
  viewDate: Date = new Date(2017, 4, 22);
  lastViewDate: Date = this.viewDate;
  refresh: Sub<any> = new Sub();
  activeDayIsOpen: boolean = true;
  weekStartsOn: number = 1;
  events$: Observable<any>;

  isTeacherSelected = false;
  filteredTeachers: Observable<Teacher[]>;
  allTeachers: Observable<Teacher[]>;
  selectedTeacher: Teacher;
  teacherControl: FormControl;

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

    this.selectedTeacher = new Teacher();
    this.selectedTeacher.name = '-';
    this.selectedTeacher.surname = '';

    this.teacherControl = new FormControl();

    this.urlSubscription = this.route.params.subscribe(params => {
      this.selectedTeacher.id = +params['id'];
      this.paramId = +params['id'];
    });
  }

  filter(name: string): Observable<Teacher[]> {
    return this.allTeachers
      .map(teachers => {
        return teachers.filter(
          (teacher) => new RegExp(`^${name}`, 'gi').test(teacher.name + ' ' + teacher.surname)
        );
      });
  }

  ngOnInit() {
    this.loadTeachers();

    this.teacherControl.valueChanges
      .subscribe(
        value => {
          this.selectedTeacher = value;
          this.filteredTeachers = this.filter(value);
          if (value instanceof Teacher) {
            this.updateTeacher();
          }
        }
      );
  }


  updateTeacher() {
    this.isTeacherSelected = !!(this.selectedTeacher instanceof Teacher && this.selectedTeacher.id);

    if (this.isTeacherSelected) {
      this.fetchEvents(false);
    }
  }

  loadTeachers() {
    const pr = this.activityService.getAllTeachers();
    this.filteredTeachers = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((teacher) => {
          return this.metadataUtil.serializedTeacherToMetadata(teacher);
        });
      });

    this.allTeachers = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((teacher) => {
          const teacherObj = this.metadataUtil.serializedTeacherToMetadata(teacher);
          if (teacherObj.id === this.selectedTeacher.id && !isNaN(this.paramId)) {
            this.selectedTeacher = teacherObj;
            this.paramId = parseFloat('nan');
          }
          return teacherObj;
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

    const pr = this.activityService.getActivitiesForTeacherOnDate(this.selectedTeacher.id, date);

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

  teacherDisplayMethod(teacher: Teacher): string {
    return teacher ? (teacher.name + ' ' + teacher.surname) : '-';
  }

  goToDay($event) {
    this.viewDate = $event.day.date;
    this.view = 'day';
  }
}
