import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity/activity.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MaterialModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {CalendarModule} from 'angular-calendar';
import {MetadataUtilService} from "./metadada-util.service";
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    Angular2FontawesomeModule,
    CalendarModule.forRoot(),
  ],
  declarations: [ActivityComponent, CalendarHeaderComponent],
  providers:[
    MetadataUtilService
  ]
})
export class IttModule { }
