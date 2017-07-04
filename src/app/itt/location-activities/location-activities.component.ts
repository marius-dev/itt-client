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

import {Subject} from 'rxjs/Subject';
import {TranslateService} from 'ng2-translate';
import {EventTitleFormatter} from '../activity/event-formatter';
import {ActivityManagerService} from '../activity/activity-manager.service';
import {Location} from '../calendar-metadata';
import {MetadataUtilService} from '../metadada-util.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-location-activities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-activities.component.html',
  styleUrls: ['./location-activities.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: CalendarEventTitleFormatter,
    useClass: EventTitleFormatter
  }]

})
export class LocationActivitiesComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'day';
  viewDate: Date = new Date(2017, 4, 22);
  lastViewDate: Date = this.viewDate;
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;
  weekStartsOn: number = 1;
  events$: Observable<any>;

  isLocationSelected = false;
  filteredLocations: Observable<Location[]>;
  allLocations: Observable<Location[]>;
  selectedLocation: Location;
  locationControl: FormControl;

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

    this.selectedLocation = new Location();
    this.locationControl = new FormControl();

    this.urlSubscription = this.route.params.subscribe(params => {
      this.selectedLocation.id = +params['id'];
      this.paramId = +params['id'];
    });


    this.locationControl.valueChanges
      .subscribe(
        value => {
          this.filteredLocations = this.filter(value);
          this.updateLocation();
        }
      );
  }

  filter(name: string): Observable<Location[]> {
    return this.allLocations
      .map(locations => {
        return locations.filter(
          (location) => new RegExp(`^${name}`, 'gi').test(location.fullName)
        );
      });
  }

  ngOnInit() { this.loadLocations(); }


  updateLocation() {
    this.isLocationSelected = !!(this.selectedLocation instanceof Location && this.selectedLocation.id && this.selectedLocation.shortName);

    if (this.isLocationSelected) {
      this.fetchEvents(false);
    }
  }

  loadLocations() {
    const pr = this.activityService.getAllLocations();
    this.filteredLocations = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((location) => {
          return this.metadataUtil.serializedLocationToMetadata(location);
        });
      });

    this.allLocations = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((location) => {
          const locationObj = this.metadataUtil.serializedLocationToMetadata(location);
          if (locationObj.id === this.selectedLocation.id && !isNaN(this.paramId)) {
            this.selectedLocation = locationObj;
            this.paramId = parseFloat('nan');
          }
          return locationObj;
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

    const pr = this.activityService.getActivitiesForLocationOnDate(this.selectedLocation.id, date);

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

  locationDisplayMethod(location: Location): string {
    return location ? location.fullName : '-';
  }

  goToDay($event) {
    this.viewDate = $event.day.date;
    this.view = 'day';
  }
}
