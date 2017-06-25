import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-duplicate-teaching-activity-component',
  templateUrl: './duplicate-teaching-activity-component.component.html',
  styleUrls: ['./duplicate-teaching-activity-component.component.scss']
})
export class DuplicateTeachingActivityComponent implements OnInit {

  @Input() duplicateFields: string;

  constructor() {
  }

  ngOnInit() {
  }

}
