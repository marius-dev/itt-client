import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {AdminComponent} from './admin/admin.component';
import {LockScreenComponent} from './session/lockscreen/lockscreen.component';
import {ForgotPasswordComponent} from './session/forgot-password/forgot-password.component';
import {LoginViewComponent} from './session/login-view/login-view.component';
import {AuthGuard} from './security/auth/auth-guard';
import {LoginComponent} from './security/auth/login/login.component';
import {UserProfileComponent} from './security/users/user-profile/user-profile.component';
import {UserCreateComponent} from './security/users/user-create/user-create.component';
import {UserListComponent} from './security/users/user-list/user-list.component';
import {ActivityComponent} from './itt/activity/activity.component';
import {TeachingActivityListComponent} from './admin/teaching-activity-list/teaching-activity-list.component';
import {TeachingActivityComponent} from './admin/teaching-activity/teaching-activity.component';
import {ActivityLoadComponent} from './admin/activity-load/activity-load.component';
import {EvaluationActivityListComponent} from './admin/evaluation-activity-list/evaluation-activity-list.component';
import {EvaluationActivityComponent} from "./admin/evaluation-activity/evaluation-activity.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  }, {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  }, {
    path: 'lockscreen',
    component: LockScreenComponent,
  }, {
    path: '',
    component: MainComponent,
    children: [
      {path: '', component: ActivityLoadComponent},
      {path: 'teaching-activity/:id', component: TeachingActivityComponent },
      {path: 'evaluation-activity/:id', component: EvaluationActivityComponent },
      {path: 'profile', component: UserProfileComponent},
      {path: 'teaching-activities', component: TeachingActivityListComponent},
      {path: 'evaluation-activities', component: EvaluationActivityListComponent},
      {path: 'forbidden', component: AdminComponent},
      {path: 'users/add', component: UserCreateComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'users/list', component: UserListComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'activities', component: ActivityComponent, canActivate: [AuthGuard], data: {roles: ['student', 'teacher']}},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
