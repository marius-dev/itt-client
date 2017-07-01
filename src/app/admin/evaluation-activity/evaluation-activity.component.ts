import {Component, OnDestroy, OnInit} from '@angular/core';
import {AcademicYear, EvaluationActivity, Location, Participant, Subject, Teacher} from '../../itt/calendar-metadata';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {Http} from '@angular/http';
import {MetadataUtilService} from '../../itt/metadada-util.service';
import {ActivityManagerService} from '../../itt/activity/activity-manager.service';
import {environment} from '../../../environments/environment';
import {academicYearRoute} from '../../external-api-routes';
import * as JQuery from 'jquery';
import {
  subDays,
  isSameDay,
  isSameYear,
  isSameMonth
} from 'date-fns';

@Component({
  selector: 'app-evaluation-activity',
  templateUrl: './evaluation-activity.component.html',
  styleUrls: ['./evaluation-activity.component.scss']
})
export class EvaluationActivityComponent implements OnInit, OnDestroy {
  activityId: number;
  urlSubscription: any;

  tmpActivity: EvaluationActivity;
  currentActivity: EvaluationActivity;
  activityObservable: Observable<EvaluationActivity>;

  allSubjects: Observable<Subject[]>;
  allTeachers: Observable<Teacher[]>;
  allRooms: Observable<Location[]>;
  allActivityTypes: Observable<string[]>;
  allParticipants: Observable<Participant[]>;
  allAcademicYears: Observable<string[]>;
  evaluationActivityTypeOptions = ['exam', 'restanta'];

  participantsId: number[];
  asistantsId: number[];

  changes;
  stateCtrl: FormControl;

  constructor(public snackBar: MdSnackBar,
              private route: ActivatedRoute,
              private http: Http,
              private metadataUtil: MetadataUtilService,
              private activityManager: ActivityManagerService) {

    this.participantsId = [];
    this.urlSubscription = this.route.params.subscribe(params => {
      this.activityId = +params['id'];
      this.fetchData();
    });

    this.changes = [];
    this.stateCtrl = new FormControl();
  }

  ngOnInit() {
    this.initModel();
    this.loadTeachers();
    this.loadLocations();
    this.loadEvaluationActivityTypes();
    this.loadParticipants();
    this.loadAcademicYears();
    this.loadSubjects();
  }


  loadLocations() {
    const pr = this.activityManager.getAllLocations();
    this.allRooms = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((location) => {
          return this.metadataUtil.serializedLocationToMetadata(location);
        });
      });
  }

  loadTeachers() {
    const pr = this.activityManager.getAllTeachers();
    this.allTeachers = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((teacher) => {
          return this.metadataUtil.serializedTeacherToMetadata(teacher);
        });
      });
  }

  loadSubjects() {
    const pr = this.activityManager.getAllSubjects();
    this.allSubjects = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((subject) => {
          return this.metadataUtil.serializedSubjectToMetadata(subject);
        });
      });
  }

  loadParticipants() {
    const pr = this.activityManager.getAllParticipants();
    this.allParticipants = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((participant) => {
          return this.metadataUtil.serializedParticipantToMetadata(participant);
        });
      });
  }

  loadEvaluationActivityTypes() {
    const pr = this.activityManager.getAllEvaluationActivityTypes();
    this.allActivityTypes = Observable.fromPromise(pr)
      .map(res => {
        return res.json();
      });
  }

  loadAcademicYears() {
    const pr: Promise<any> = this.http
      .get(environment.coreIttUrl + '/' + academicYearRoute + '/')
      .toPromise();

    this.allAcademicYears = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((year) => {
          return (year);
        });
      });
  }

  loadActivityById(activityId: number): Observable<EvaluationActivity> {
    const pr = this.activityManager.getEvaluationActivityById(activityId);
    return Observable.fromPromise(pr)
      .map(res => {
        return this.metadataUtil.serializedEvaluationActivityToMetadata(res.json());
      });
  }

  private initModel() {
    this.tmpActivity = new EvaluationActivity();
    this.tmpActivity.subject = new Subject();
    this.tmpActivity.teacher = new Teacher();
    this.tmpActivity.location = new Location();
    this.tmpActivity.academicYear = new AcademicYear();
  }

  updateChanges() {
    this.changes = [];

    if (this.currentActivity.teacher.id !== this.tmpActivity.teacher.id) {
      this.changes.push({teacher: this.tmpActivity.teacher.id});
    }
    if (this.currentActivity.location.id !== this.tmpActivity.location.id) {
      this.changes.push({location: this.tmpActivity.location.id});
    }
    if (this.currentActivity.duration !== this.tmpActivity.duration) {
      this.changes.push({duration: this.tmpActivity.duration});
    }
    if (this.currentActivity.hour !== this.tmpActivity.hour) {
      this.changes.push({hour: this.tmpActivity.hour});
    }
    if (this.currentActivity.activityCategory !== this.tmpActivity.activityCategory) {
      this.changes.push({activityCategory: this.tmpActivity.activityCategory});
    }
    if (this.areDiffernt(this.participantsId, this.getParticipantsIdsFormActivity(this.currentActivity))) {
      this.changes.push({participants: this.participantsId});
    }
    if (this.areDatesDiffernt(this.tmpActivity.date, this.currentActivity.date)) {
      this.changes.push({date: this.tmpActivity.date});
    }
    if (this.currentActivity.subject.id !== this.tmpActivity.subject.id) {
      this.changes.push({subject: this.tmpActivity.subject.id});
    }
    // console.log(this.currentActivity.date);
    // console.log(this.tmpActivity.date);
    console.log(this.changes);
  }

  updateChangesWithDelay(delay) {
    setTimeout(() => {
      this.updateChanges();
    }, delay);
  }

  private getParticipantsIdsFormActivity(activity: EvaluationActivity): number[] {
    const ids = [];
    activity.participants.map(part => {
      ids.push(part.id);
    });

    return ids;
  }

  restoreModel() {
    if (this.changes.length !== 0) {
      this.activityObservable.subscribe(data => {
        this.tmpActivity = data;
        this.participantsId = this.getParticipantsIdsFormActivity(data);
        this.openSnackBar('Restored');
      });
      this.changes = [];
    } else {
      this.openSnackBar('Data unchanged');
    }
  }

  sendChanges() {
    if (this.changes.length !== 0) {
      this.activityManager.updateEvaluationActivity(this.currentActivity.id, this.arrayToObject(this.changes))
        .toPromise()
        .then(resp => {
          this.openSnackBar('Updated');
          this.changes = [];
          this.fetchData();
        })
        .catch(err => {
          this.openSnackBar(err);
        });
    } else {
      this.openSnackBar('Noting to update');
    }
  }

  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy() {
    this.urlSubscription.unsubscribe();
  }

  private arrayToObject(array) {
    const object = {};
    array.map(
      data => {
        JQuery.extend(object, data);
      });
    return object;
  }

  private fetchData() {
    this.activityObservable = this.loadActivityById(this.activityId);

    this.activityObservable.subscribe(data => {
      this.currentActivity = data;
      this.participantsId = this.getParticipantsIdsFormActivity(data);
    });
    this.activityObservable.subscribe(data => this.tmpActivity = data);
  }

  private areDiffernt(array1, array2) {
    return (array1.sort().join('') !== array2.sort().join(''));
  }

  private areDatesDiffernt(date1, date2): boolean {
    return !(isSameDay(date1, date2) && isSameMonth(date1, date2) && isSameYear(date1, date2));
  }
}
