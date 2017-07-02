import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {environment} from '../../../environments/environment';
import {participantRoute} from '../../external-api-routes';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {FormControl} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from 'ng2-translate';
import {MetadataUtilService} from '../metadada-util.service';
import {ActivityManagerService} from '../activity/activity-manager.service';
import {CalendarEvent, CalendarEventTitleFormatter} from 'angular-calendar';
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
import {EventTitleFormatter} from '../activity/event-formatter';
import {TreeNode} from 'angular-tree-component';

@Component({
  selector: 'app-participants-structure',
  templateUrl: './participants-structure.component.html',
  styleUrls: ['./participants-structure.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: EventTitleFormatter
  }]
})
export class ParticipantsStructureComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  nodes$: Observable<TreeNode[]>;

  view: string = 'day';
  viewDate: Date = new Date(2017, 4, 22);
  lastViewDate: Date = this.viewDate;
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  weekStartsOn: number = 1;
  events$: Observable<any>;

  participantId: number;

  modalData: {
    action: string,
    event: CalendarEvent
  };

  options = {
    dropSlotHeight: 3
  };

  constructor(private modal: NgbModal,
              private translate: TranslateService,
              private metadataUtil: MetadataUtilService,
              private http: Http,
              private activityService: ActivityManagerService) {

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'ro');

  }

  ngOnInit() {
    const pr = this.getParticipantsTreeStructure();
    this.nodes$ = Observable.fromPromise(pr)
      .map(result => result.json())
      .map(departments => {
        return departments.map(department => this.getTreeStructureForDepartment(department));
      });
  }


  onSelectedParticipant($event) {
    this.participantId = $event.node.id;
    this.fetchEvents(false);
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

    const pr = this.activityService.getActivitiesForParticipantOnDate(this.participantId, date);

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

  goToDay($event) {
    this.viewDate = $event.day.date;
    this.view = 'day';
  }

  getTreeStructureForDepartment(department) {
    return {
      id: department.value._id,
      name: department.value.shortName,
      children: department.value.part_of
        .map(specialization => this.getTreeStructureForSpecialization(specialization))
    };
  }

  getTreeStructureForSpecialization(specialization) {
    return {
      id: specialization._id,
      name: specialization.identifier,
      children: specialization.part_of ? specialization.part_of.map(series => this.getTreeStructureForSeries(series)) : []
    };
  }

  getTreeStructureForSeries(series) {
    return {
      id: series._id,
      name: series.identifier,
      children: series.part_of ? series.part_of.map(subSeries => this.getTreeStructureForSubSeries(subSeries)) : []
    };
  }

  getTreeStructureForSubSeries(subSeries) {
    return {
      id: subSeries._id,
      name: subSeries.identifier
    };
  }

  getParticipantsTreeStructure(): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        environment.coreIttUrl + '/' + participantRoute + '/departments',
        options
      )
      .toPromise();
  }


  updateChangesWithDelay(delay) {
    setTimeout(() => {
      this.fetchEvents();
    }, delay);
  }
}
