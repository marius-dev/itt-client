import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-not-found-elements',
  templateUrl: './not-found-elements.component.html',
  styleUrls: ['./not-found-elements.component.scss']
})
export class NotFoundElementsComponent implements OnInit {


  @Input() notFoundedFields: string;

  constructor() { }

  ngOnInit() {
  }

}
