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


  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  semesterOptions: number[];
  academicYearOptions: Observable<number[]>;

  duplicateAtctivities = [];

  selectedSemester: number;
  selectedAcademicYear: string;

  constructor(private http: Http,
              private modalService: NgbModal) {
    this.uploader = new FileUploader({});
    this.semesterOptions = [1, 2];
    this.fetchAcademicYears();
  }

  ngOnInit() {
    this.uploader.onErrorItem = (item: any, response: any, status: 409, headers: any) => {
      const responsePath = JSON.parse(response);
      const fields = JSON.parse(responsePath.error.exception[0].message);
      this.duplicateAtctivities = fields;
      this.modalService.open(this.duplicateErrorModal, {size: 'lg'});
    };
  }

  changeTarget() {
    const url = environment.coreIttUrl + '/' +
      activityRoutes.teachingActivityApi + '/file/' +
      this.selectedAcademicYear + '/' + this.selectedSemester;
    this.uploader.setOptions({url: url});
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
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
