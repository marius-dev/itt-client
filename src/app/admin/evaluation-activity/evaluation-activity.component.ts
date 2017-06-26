import {Component, OnDestroy, OnInit} from '@angular/core';
import {EvaluationActivity, Location, Participant, Subject, Teacher} from '../../itt/calendar-metadata';
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

@Component({
  selector: 'app-evaluation-activity',
  templateUrl: './evaluation-activity.component.html',
  styleUrls: ['./evaluation-activity.component.scss']
})
export class EvaluationActivityComponent implements OnInit, OnDestroy {
  activityId: number;
  private urlSubscription: any;

  tmpActivity: EvaluationActivity;
  currentActivity: EvaluationActivity;
  activityObservable: Observable<EvaluationActivity>;

  private allSubjects: Observable<Subject[]>;
  private allTeachers: Observable<Teacher[]>;
  private allRooms: Observable<Location[]>;
  private allActivityTypes: Observable<string[]>;
  private allParticipants: Observable<Participant[]>;
  private allAcademicYears: Observable<string[]>;

  participantsId: number[];

  private changes;
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
    this.loadTeachingActivityTypes();
    this.loadParticipants();
    this.loadAcademicYears();
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

  loadParticipants() {
    const pr = this.activityManager.getAllParticipants();
    this.allParticipants = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((participant) => {
          return this.metadataUtil.serializedParticipantToMetadata(participant);
        });
      });
  }

  loadTeachingActivityTypes() {
    const pr = this.activityManager.getAllTeachingActivityTypes();
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
    const pr = this.activityManager.getActivityById(activityId);
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

    console.log(this.changes);
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
      this.activityManager.updateTeachingActivity(this.currentActivity.id, this.arrayToObject(this.changes))
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
}
