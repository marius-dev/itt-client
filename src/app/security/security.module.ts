import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {environment} from '../../environments/environment';
import {AngularFireModule} from 'angularfire2';
import {RoleService} from './roles/role.service';
import {AuthService} from './auth/auth.service';
import {UserService} from './users/user.service';
import {AuthGuard} from './auth/auth-guard';
import {UploadService} from './storage/upload.service';
import {LoginComponent} from './auth/login/login.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginViewComponent} from '../session/login-view/login-view.component';
import {EqualTextValidatorDirective} from './users/equal.validator';
import {UserProfileComponent} from './users/user-profile/user-profile.component';
import {AskForUserRemovalComponent, UserComponent} from './users/user/user.component';
import {UserCreateComponent} from './users/user-create/user-create.component';
import {UserListComponent} from './users/user-list/user-list.component';
import {AppRoutingModule} from '../app-routing.module';

import {ImageCropperComponent} from 'ng2-img-cropper';
import {FormsModule} from '@angular/forms';
import {MaterialModule, MdDialogModule} from '@angular/material';
import {LockScreenComponent} from '../session/lockscreen/lockscreen.component';
import {ForgotPasswordComponent} from '../session/forgot-password/forgot-password.component';
import {Angular2FontawesomeModule} from 'angular2-fontawesome';
import {AngularFireDatabase} from 'angularfire2/database';

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig, 'itt-admin'),
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    Angular2FontawesomeModule,
    CommonModule,
    AppRoutingModule,
    MdDialogModule
  ],
  declarations: [
    LoginComponent,
    UserProfileComponent,
    UserComponent,
    UserCreateComponent,
    UserListComponent,
    EqualTextValidatorDirective,
    ImageCropperComponent,
    LoginViewComponent,
    LockScreenComponent,
    ForgotPasswordComponent,
    AskForUserRemovalComponent
  ],
  providers: [
    AuthService,
    UserService,
    AuthGuard,
    RoleService,
    UploadService,
    AngularFireDatabase
  ]
})
export class SecurityModule {
}
