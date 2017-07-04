import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityComponent} from './activity/activity.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {CalendarModule} from 'angular-calendar';
import {MetadataUtilService} from './metadada-util.service';
import {CalendarHeaderComponent} from './calendar-header/calendar-header.component';
import {LocationActivitiesComponent} from './location-activities/location-activities.component';
import {ActivityDetailsComponent} from './activity-details/activity-details.component';
import {TypeCheckPipe} from './type-check.pipe';
import {TranslateLoader, TranslateModule} from 'ng2-translate';
import {createTranslateLoader} from '../app.module';
import {Http} from '@angular/http';
import {ParticipantsStructureComponent} from './participants-structure/participants-structure.component';
import {TreeModule} from 'angular-tree-component';
import {RouterModule} from '@angular/router';
import {SubjectActivitiesComponent} from './subject-activities/subject-activities.component';
import {TeacherActivitiesComponent} from './teacher-activities/teacher-activities.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Angular2FontawesomeModule,
    TreeModule,
    RouterModule,
    CalendarModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [
    ActivityComponent,
    SubjectActivitiesComponent,
    TeacherActivitiesComponent,
    CalendarHeaderComponent,
    LocationActivitiesComponent,
    ActivityDetailsComponent,
    TypeCheckPipe,
    ParticipantsStructureComponent
  ],
  providers: [
    MetadataUtilService
  ]
})
export class IttModule {
}
