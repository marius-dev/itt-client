import {Component, OnInit} from '@angular/core';
import {fadeInAnimation} from '../../core/route-animation/route.animation';
import {Participant, Specialization, TeachingActivity} from '../../itt/calendar-metadata';
import {MdAutocomplete} from 'md-autocomplete';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {environment} from '../../../environments/environment';
import {academicYearRoute, activityRoutes, specializationRoute} from '../../external-api-routes';
import {FormControl} from '@angular/forms';
import {ActivityManagerService} from '../../itt/activity/activity-manager.service';
import {MetadataUtilService} from '../../itt/metadada-util.service';

@Component({
  selector: 'app-teaching-activity-list',
  templateUrl: './teaching-activity-list.component.html',
  styleUrls: ['./teaching-activity-list.component.scss'],
  animations: [fadeInAnimation]
})
export class TeachingActivityListComponent implements OnInit {

  specialization: number;
  academicYear: string;
  semesterNumber: number;
  specializationOptions: Observable<Specialization[]>;
  academicYearOptions: Observable<any[]>;
  semesterOptions = [1, 2];

  tableVisible: boolean = false;
  tableLoader: boolean = true;

  rows = [];
  temp = [];
  columns = [
    {prop: 'SUBJECT'},
    {name: 'ROOM'},
    {name: 'TEACHER'},
    {name: 'ACTIVITY_TYPE'},
    {name: 'DAY'},
    {name: 'HOUR'},
    {name: 'DURATION'},
    {name: 'PARTICIPANTS'}
  ];

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

  fetchActivities() {
    this.tableLoader = true;
    this.tableVisible = true;
    const pr = this.activityManager.getAllActivitiesBySemesterAndSpecialization(
      this.academicYear,
      this.semesterNumber,
      this.specialization
    );
    Observable.fromPromise(pr)
      .map(res => {
        return res.json().map((act) => {
          return this.setTeachingActivityToTableRow(
            this.metadataUtil.serializedTeachingActivityToMetadata(act)
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

    // filter our data
    // update the rows
    this.rows = this.temp.filter(function (d) {
      return d.subject.toLowerCase().indexOf(val.toLowerCase()) !== -1 || !val;
    });
  }


  setTeachingActivityToTableRow(teachingActivity: TeachingActivity) {
    return {
      id: teachingActivity.id,
      subject: teachingActivity.subject.fullName,
      room: teachingActivity.location.shortName,
      teacher: teachingActivity.teacher.name + ' ' + teachingActivity.teacher.surname,
      activityType: teachingActivity.activityCategory,
      day: teachingActivity.day,
      hour: teachingActivity.hour,
      duration: teachingActivity.duration,
      participants: this.participantsToString(
        teachingActivity.participants
      )
    };
  }

  participantsToString(participamts: Participant[]) {
    return participamts
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
