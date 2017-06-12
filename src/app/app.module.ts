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
import {ForgotPasswordComponent} from './session/forgot-password/forgot-password.component';
import {LockScreenComponent} from './session/lockscreen/lockscreen.component';
import {LoginComponent} from './session/login/login.component';
import {MaterialModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PerfectScrollbarModule, PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {MenuToggleModule} from './core/menu/menu-toggle.module';
import {QuillModule} from 'ngx-quill';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BreadcrumbsComponent} from './core/breadcrumb/breadcrumb.component';
import {MenuItems} from './core/menu/menu-items/menu-items';
import {BreadcrumbService} from './core/breadcrumb/breadcrumb.service';
import {PageTitleService} from './core/page-title/page-title.service';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

const perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    MainComponent,
    LoginComponent,
    ForgotPasswordComponent,
    LockScreenComponent,
    BreadcrumbsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SecurityModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
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
  providers: [
    MenuItems,
    BreadcrumbService,
    PageTitleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
