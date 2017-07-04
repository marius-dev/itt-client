import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {environment} from '../../../environments/environment';
import {activityRoutes, locationRoute, participantRoute, subjectRoute, teacherRoutes} from '../../external-api-routes';
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
import {Router} from '@angular/router';


@Injectable()
export class ActivityManagerService {

  private user;

  constructor(private http: Http,
              private authService: AuthService,
              private router: Router,
              private metadataUtil: MetadataUtilService,
              private translate: TranslateService) {
    this.loadCurrentUser();

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ro/) ? browserLang : 'en');
  }


  loadCurrentUser() {
    this.authService.currentUser().subscribe(user => {
      this.user = user;
    });
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

  public getAllSubjects() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + subjectRoute + '/', options)
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

  public getActivitiesForCurrentUserOnDate(date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});


    if (this.user === null) {
      this.router.navigateByUrl('/login');
      this.loadCurrentUser();
      this.sleep(1000);
    }

    if (this.user.role.name === 'student') {

      return this.http
        .post(environment.coreIttUrl + '/' + studentRoutes.rootApi + '/email', JSON.stringify({email: this.user.profile.email}), options)
        .toPromise()
        .then(
          res => {
            const student = res.json();
            return this.getActivitiesForStudentOnDate(student.id, date);
          }
        )
        .catch(err => {
          return this.handleError(err);
        });
    }

    if (this.user.role.name === 'teacher') {
      return this.http
        .post(environment.coreIttUrl + '/' + teacherRoutes + '/email', JSON.stringify({email: this.user.profile.email}), options)
        .toPromise()
        .then(
          res => {
            const teacher = res.json();
            return this.getActivitiesForTeacherOnDate(teacher.id, date);
          }
        )
        .catch(err => {
          return this.handleError(err);
        });
    }
  }

  getActivitiesForTeacherOnDate(teacherId: number, date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    const dateAsString = format(date, 'DD-MM-YYYY');
    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/teacher/' + teacherId + '/' + dateAsString, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  getActivitiesForStudentOnDate(studentId: number, date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    const dateAsString = format(date, 'DD-MM-YYYY');
    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/student/' + studentId + '/' + dateAsString, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  getActivitiesForLocationOnDate(locationId, date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    const dateAsString = format(date, 'DD-MM-YYYY');
    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/location/' + locationId + '/' + dateAsString, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  getActivitiesForSubjectOnDate(locationId, date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    const dateAsString = format(date, 'DD-MM-YYYY');
    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/subject/' + locationId + '/' + dateAsString, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  getActivitiesForParticipantOnDate(participantId, date: Date): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({headers: headers});

    const dateAsString = format(date, 'DD-MM-YYYY');
    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.activityApi + '/participant/' + participantId + '/' + dateAsString, options)
      .toPromise()
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
        academicYear + '/' + specializationId + '/' + type,
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

  public getAllTeachongActivitiesByAcademicYearSpecializtion(academicYear: string,
                                                             semesterNumber: number,
                                                             specializationId: number): Promise<any> {
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

  public getTeachingActivityById(activityId: number): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.teachingActivityApi + '/' + activityId, options)
      .toPromise()
      .catch(err => {
        return this.handleError(err);
      });
  }

  public getEvaluationActivityById(activityId: number): Promise<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({headers: headers});

    return this.http
      .get(environment.coreIttUrl + '/' + activityRoutes.evaluationActivityApi + '/' + activityId, options)
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
    const examCateories = ['exam', 'project_presentation', 'coloquim', 'coloquim'];

    if (examCateories.indexOf(serializedActivity.activityCategory) > -1) {
      return this.evaluationActivityToCalendarObject(serializedActivity);
    } else if (serializedActivity.activityCategory === 'practice') {
      return this.practiceActivityToCalendarObject(serializedActivity);
    } else {
      return this.teachingActivityToCalendarObject(serializedActivity, date);
    }
  }

  public practiceActivityToCalendarObject(serializedActivity): CalendarEvent {

    const startDate = new Date(serializedActivity.period.startDate);
    const endDate = new Date(serializedActivity.period.endDate);

    return {
      start: startDate,
      end: endDate,
      title: serializedActivity.activityName,
      color: this.colorByActivityType(serializedActivity.activityCategory),
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false,
      cssClass: 'event-view',
      meta: serializedActivity
    };
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
      title: '<b>' + this.translate.instant(activity.activityCategory) + '</b> ' + this.translate.instant('at') + ' <b>' +
      activity.subject.fullName + '</b> - ' +
      activity.teacher.name + ' ' + activity.teacher.surname + ' ',

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

  public evaluationActivityToCalendarObject(serializedActivity): CalendarEvent {

    const activity = this.metadataUtil.serializedEvaluationActivityToMetadata(serializedActivity);

    const startDate = activity.date;

    startDate.setHours(activity.hour);
    const endDate = addHours(startDate, activity.duration);


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

  get currentUser() {
    return this.user;
  }

  colorByActivityType(type: string) {
    switch (type) {
      case 'exam':
        return {
          primary: '#ad2121',
          secondary: '#FAE3E3'
        };
      case 'project_presentation':
        return {
          primary: '#a762ad',
          secondary: '#fad9f8'
        };
      case 'coloquim':
        return {
          primary: '#45acad',
          secondary: '#fa2b3d'
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

  sleep(milliseconds) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }
}
