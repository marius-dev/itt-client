import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate';
import {EvaluationActivity, TeachingActivity} from '../calendar-metadata';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.scss'],
})
export class ActivityDetailsComponent implements OnInit {

  @Input() activityDetails;

  constructor() {
  }

  ngOnInit() {
  }

  instanceOfEvaluationAcivity(val): boolean {
    return val instanceof EvaluationActivity;
  }
  instanceOfTeachingActivity(val): boolean {
    return val instanceof TeachingActivity;
  }

  isPracticeActivity(val): boolean {
    return val.activityCategory === 'practice';
  }
}
