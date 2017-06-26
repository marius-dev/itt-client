import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {academicYearRoute, activityRoutes} from '../../external-api-routes';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DuplicateTeachingActivityComponent} from '../error-views/duplicate-teaching-activity-component/duplicate-teaching-activity-component.component';

@Component({
  selector: 'app-activity-load',
  templateUrl: './activity-load.component.html',
  styleUrls: ['./activity-load.component.scss']
})
export class ActivityLoadComponent implements OnInit {
  @ViewChild('error_modal_duplicate_activities') duplicateErrorModal: TemplateRef<any>;

  currentTab: string;

  teachingActivityUploader: FileUploader;
  evaluationActivityUploader: FileUploader;

  teachingActivityDropDownHover = false;
  evaluationActivityDropDownHover = false;

  evaluationActivityTypeOptions: string[];
  semesterOptions: number[];
  academicYearOptions: Observable<number[]>;

  duplicateActivities = [];

  selectedSemester: number;
  selectedAcademicYear: string;
  selectedEvaluationType: string;

  constructor(private http: Http,
              private modalService: NgbModal) {
    this.teachingActivityUploader = new FileUploader({});
    this.evaluationActivityUploader = new FileUploader({});
    this.semesterOptions = [1, 2];
    this.evaluationActivityTypeOptions = ['exam','restanta'];
    this.fetchAcademicYears();
  }

  ngOnInit() {
    this.teachingActivityUploader.onErrorItem = (item: any, response: any, status: 409, headers: any) => {
      const responsePath = JSON.parse(response);
      this.duplicateActivities = JSON.parse(responsePath.error.exception[0].message);
      this.modalService.open(this.duplicateErrorModal, {size: 'lg'});
    };

    this.evaluationActivityUploader.onErrorItem = (item: any, response: any, status: 409, headers: any) => {
      const responsePath = JSON.parse(response);
      this.duplicateActivities = JSON.parse(responsePath.error.exception[0].message);
      this.modalService.open(this.duplicateErrorModal, {size: 'lg'});
    };
  }

  changeTarget() {
    const taUrl = environment.coreIttUrl + '/' +
      activityRoutes.teachingActivityApi + '/file/' +
      this.selectedAcademicYear + '/' + this.selectedSemester;
    this.teachingActivityUploader.setOptions({url: taUrl});

    const eaUrl = environment.coreIttUrl + '/' +
      activityRoutes.evaluationActivityApi + '/file/' +
      this.selectedAcademicYear + '/' + this.selectedEvaluationType;
    this.evaluationActivityUploader.setOptions({url: eaUrl});
  }

  fileOverTeachingActivityBase(e: any): void {
    this.teachingActivityDropDownHover = e;
  }

  fileOverEvaluationActivityBase(e: any): void {
    this.evaluationActivityDropDownHover = e;
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
