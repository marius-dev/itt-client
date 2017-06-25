import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {EvaluationActivity, Participant, Specialization, TeachingActivity} from '../../itt/calendar-metadata';
import {Http} from '@angular/http';
import {MetadataUtilService} from '../../itt/metadada-util.service';
import {ActivityManagerService} from '../../itt/activity/activity-manager.service';
import {academicYearRoute, specializationRoute} from '../../external-api-routes';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-evaluation-activity-list',
  templateUrl: './evaluation-activity-list.component.html',
  styleUrls: ['./evaluation-activity-list.component.scss']
})
export class EvaluationActivityListComponent implements OnInit {

  specialization: number;
  academicYear: string;
  evaluationActivityType: string;

  specializationOptions: Observable<Specialization[]>;
  academicYearOptions: Observable<any[]>;
  evaluationActivityTypeOptions = ['exam', 'restanta'];

  tableVisible: boolean = false;
  tableLoader: boolean = true;

  rows = [];
  temp = [];

  constructor(private http: Http,
              private metadataUtil: MetadataUtilService,
              private activityManager: ActivityManagerService) {

    // this.fetch((data) => {
    //   // cache our list
    //   this.temp = [...data];
    //
    //   // push our inital complete list
    //   this.rows = data;
    // });
  }

  ngOnInit() {
    this.fetchSpecializations();
    this.fetchAcademicYears();
  }

  public checkFormChanged(form) {
    if (form.form.valid) {
      this.fetchActivities();
    }
  }

  fetchActivities() {
    this.tableLoader = true;
    this.tableVisible = true;
    const pr = this.activityManager.getAllEvaluationActivitiesBySemesterAndSpecialization(
      this.academicYear,
      this.specialization,
      this.evaluationActivityType
    );
    Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((act) => {
          return this.setEvaluationActivityToTableRow(
            this.metadataUtil.serializedEvaluationActivityToMetadata(act)
          );
        });
      }).subscribe(data => {
      this.rows = data;
      this.temp = [...data];
      this.tableLoader = false;
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateFilter(event) {
    const val = event.target.value;
    this.rows = this.temp.filter(function (d) {
      return d.subject.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val;
    });
  }

  setEvaluationActivityToTableRow(evaluationActivity: EvaluationActivity) {
    return {
      id: evaluationActivity.id,
      subject: evaluationActivity.subject.fullName,
      room: evaluationActivity.location.shortName,
      teacher: evaluationActivity.teacher.name + ' ' + evaluationActivity.teacher.surname,
      activityType: evaluationActivity.activityCategory,
      date: evaluationActivity.date,
      hour: evaluationActivity.hour,
      duration: evaluationActivity.duration,
      participants: this.participantsToString(
        evaluationActivity.participants
      )
    };
  }

  participantsToString(participants: Participant[]) {
    return participants
      .map(
        participant => participant.identifier
      )
      .join(',');
  }

  fetchSpecializations() {
    const pr: Promise<any> = this.http
      .get(environment.coreIttUrl + '/' + specializationRoute + '/all')
      .toPromise();

    this.specializationOptions = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((spec) => {
          return (spec as Specialization);
        });
      });
  }

  fetchAcademicYears() {
    const pr: Promise<any> = this.http
      .get(environment.coreIttUrl + '/' + academicYearRoute + '/')
      .toPromise();

    this.academicYearOptions = Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((year) => {
          return (year);
        });
      });
  }
}
