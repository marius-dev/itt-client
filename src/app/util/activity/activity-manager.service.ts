import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {environment} from '../../../environments/environment';
import {activityRoutes} from '../../external-api-routes';
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
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
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

@Injectable()
export class ActivityManagerService {

  private user;

  constructor(private http: Http,
              private authService: AuthService,
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
          const dateAsString = date.getDay() + '-' + date.getMonth() + '-' + date.getFullYear();
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

  public activitiesToCalendarObjects(serializedActivities, date: Date) {
    let events: CalendarEvent[];

    serializedActivities.forEach((item, index) => {
      events.push(this.activityToCalendarObject(item, date));
    });

    return events;
  }

  public activityToCalendarObject(serializedActivity, date: Date): CalendarEvent {
    let startDate = date;
    startDate.setHours(serializedActivity.hour, 0);
    startDate = addDays(startDate, serializedActivity.day);
    console.log(startDate);
    const endDate = addHours(startDate, serializedActivity.duration);

    return {
      start: startDate,
      end: endDate,
      title: this.translate.instant(serializedActivity.activityCategory) + ' ' + this.translate.instant('at') + ' ' +
      serializedActivity.subject.fullName + ' - ' +
      serializedActivity.teacher.name + ' ' + serializedActivity.teacher.surname,

      color: colors.yellow,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      draggable: false
    };
  }

}
