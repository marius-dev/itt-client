import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';
import {SecurityModule} from './security/security.module';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';

import 'hammerjs';

import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AdminComponent} from './admin/admin.component';
import {MainComponent} from './main/main.component';
import {MaterialModule, MdAutocompleteModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {MenuToggleModule} from './core/menu/menu-toggle.module';
import {QuillModule} from 'ngx-quill';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BreadcrumbsComponent} from './core/breadcrumb/breadcrumb.component';
import {MenuItems} from './core/menu/menu-items/menu-items';
import {BreadcrumbService} from './core/breadcrumb/breadcrumb.service';
import {PageTitleService} from './core/page-title/page-title.service';

import {environment} from '../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {AskForUserRemovalComponent} from './security/users/user/user.component';
import {IttModule} from './itt/itt.module';
import {ActivityManagerService} from './itt/activity/activity-manager.service';
import {CalendarModule} from 'angular-calendar';
import { ActivityLoadComponent } from './admin/activity-load/activity-load.component';
import { TeachingActivityComponent } from './admin/teaching-activity/teaching-activity.component';
import { EvaluationActivityComponent } from './admin/evaluation-activity/evaluation-activity.component';
import { EvaluationActivityListComponent } from './admin/evaluation-activity-list/evaluation-activity-list.component';
import { TeachingActivityListComponent } from './admin/teaching-activity-list/teaching-activity-list.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {FileUploadModule} from 'ng2-file-upload';
import {SortablejsModule} from 'angular-sortablejs';
import {TruncatePipe} from './util/truncate.pipe';
import { DuplicateTeachingActivityComponent } from './admin/error-views/duplicate-teaching-activity-component/duplicate-teaching-activity-component.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export const firebaseConfig = environment.firebaseConfig;



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MainComponent,
    BreadcrumbsComponent,
    ActivityLoadComponent,
    TeachingActivityComponent,
    EvaluationActivityComponent,
    EvaluationActivityListComponent,
    TeachingActivityListComponent,
    TruncatePipe,
    DuplicateTeachingActivityComponent
  ],
  imports: [
    MdAutocompleteModule,
    SortablejsModule,
    FileUploadModule,
    NgxDatatableModule,
    CalendarModule.forRoot(),
    IttModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    SecurityModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    Angular2FontawesomeModule,
    FlexLayoutModule,
    QuillModule,
    PerfectScrollbarModule.forRoot(perfectScrollbarConfig),
    MenuToggleModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  entryComponents: [
    AskForUserRemovalComponent,
    DuplicateTeachingActivityComponent
  ],
  providers: [
    MenuItems,
    BreadcrumbService,
    PageTitleService,
    AngularFireAuth,
    AngularFireDatabase,
    ActivityManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
