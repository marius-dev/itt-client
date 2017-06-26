import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {environment} from '../../../environments/environment';
import {activityRoutes, locationRoute, participantRoute, teacherRoutes} from '../../external-api-routes';
import {studentRoutes} from '../../external-api-routes';
import {UserService} from '../../security/users/user.service';
import {AuthService} from '../../security/auth/auth.service';
import {Observable} from 'rxjs/Observable';

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
  format
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {TranslateService} from 'ng2-translate';
import {MetadataUtilService} from '../metadada-util.service';
import {throttle} from 'rxjs/operator/throttle';


@Injectable()
export class ActivityManagerService {

  private user;

  constructor(private http: Http,
              private authService: AuthService,
              private metadataUtil: MetadataUtilService,
              private translate: TranslateService) {
    this.authService.currentUser().subscribe(user => {
      this.user = user;
    });

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  public getAllLocations() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + locationRoute + '/', options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });

  }

  public getAllTeachers() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + teacherRoutes + '/', options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getAllParticipants() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + participantRoute + '/', options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });

  }

  public getAllTeachingActivityTypes() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.teachingActivityApi + '/all-types', options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });

  }

  public getAllEvaluationActivityTypes() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.evaluationActivityApi + '/all-types', options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });

  }

  public updateEvaluationActivity(activityId, changes): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .put(environment.coreIttUrl + '/' + activityRoutes.evaluationActivityApi + '/' + activityId, JSON.stringify(changes), options);
  }

  public updateTeachingActivity(activityId, changes): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .put(environment.coreIttUrl + '/' + activityRoutes.teachingActivityApi + '/' + activityId, JSON.stringify(changes), options);
  }

  public getActivitiesOnDate(date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .post(environment.coreIttUrl + '/' + studentRoutes.rootApi + '/email', JSON.stringify({email: this.user.profile.email}), options)
      .toPromise()
      .then(
        res => {
          const student = res.json();
          const dateAsString = format(date, 'DD-MM-YYYY');
          return this.http
            .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/student/' + student.id + '/' + dateAsString, options)
            .toPromise()
            .catch(err => {
              return this.handleError(err);
            });
        }
      )
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getAllEvaluationActivitiesBySemesterAndSpecialization(academicYear: string, specializationId: number, type: string): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        environment.coreIttUrl + '/' + activityRoutes.evaluationActivityApi + '/all/' +
        academicYear + '/' + specializationId + '/' + type ,
        options
      )
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getAllActivitiesBySemesterAndSpecializationAndType(academicYear: string, specializationId: number, type: string): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        environment.coreIttUrl + '/' + activityRoutes.evaluationActivityApi + '/all/' +
        academicYear + '/' + specializationId,
        options
      )
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getAllTeachongActivitiesByAcademicYearSpecializtion(
    academicYear: string,
    semesterNumber: number,
    specializationId: number
  ): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        environment.coreIttUrl + '/' + activityRoutes.teachingActivityApi + '/all/' +
        academicYear + '/' + semesterNumber + '/' + specializationId,
        options
      )
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getActivityById(activityId: number): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/' + activityId, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public activitiesToCalendarObjects(serializedActivities, date: Date) {
    const events: CalendarEvent[] = [];

    serializedActivities.forEach((item, index) => {
      events.push(this.activityToCalendarObject(item, date));
    });

    return events;
  }

  public activityToCalendarObject(serializedActivity, date: Date): CalendarEvent {
    if (serializedActivity.activityCategory === 'practice') {
      return this.practiceActivityToCalendarObject(serializedActivity);
    } else {
      return this.teachingActivityToCalendarObject(serializedActivity, date);
    }
  }

  public practiceActivityToCalendarObject(serializedActivity): CalendarEvent {

    console.log(serializedActivity.period.startDate);

    const startDate = new Date(serializedActivity.period.startDate);
    const endDate = new Date(serializedActivity.period.endDate);

    console.log(startDate);
    console.log(endDate);

    const caledndarEvent = {
      start: startDate,
      end: endDate,
      title: serializedActivity.activityName,
      color: this.colorByActivityType(serializedActivity.activityCategory),
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false,
      cssClass: 'event-view'
    };

    return caledndarEvent;
  }

  public teachingActivityToCalendarObject(serializedActivity, date: Date): CalendarEvent {
    let startDate = date;

    startDate.setHours(serializedActivity.hour);
    startDate = addDays(startDate, serializedActivity.day - 1);

    const endDate = addHours(startDate, serializedActivity.duration);

    const activity = this.metadataUtil.serializedTeachingActivityToMetadata(serializedActivity);

    const caledndarEvent = {
      start: startDate,
      end: endDate,
      title: this.translate.instant(activity.activityCategory) + ' ' + this.translate.instant('at') + ' ' +
      activity.subject.fullName + ' - ' +
      activity.teacher.name + ' ' + activity.teacher.surname,

      color: this.colorByActivityType(activity.activityCategory),
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false,
      cssClass: 'event-view',
      meta: activity
    };

    return caledndarEvent;
  }

  colorByActivityType(type: string) {
    switch (type) {
      case 'exam':
        return {
          primary: '#ad2121',
          secondary: '#FAE3E3'
        };
      case 'course':
        return {
          primary: '#1e90ff',
          secondary: '#D1E8FF'
        };
      case 'laboratory':
        return {
          primary: '#39ad0c',
          secondary: '#75e95b'
        };
      default:
        return {
          primary: '#e3bc08',
          secondary: '#FDF1BA'
        };
    }
  }
}
