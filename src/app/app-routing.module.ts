import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {AdminComponent} from './admin/admin.component';
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
import {EvaluationActivityComponent} from './admin/evaluation-activity/evaluation-activity.component';
import {DatabaseViewComponent} from './admin/database-view/database-view.component';
import {ParticipantsStructureComponent} from './itt/participants-structure/participants-structure.component';
import {ForgotPasswordComponent} from './security/session/forgot-password/forgot-password.component';
import {LockScreenComponent} from './security/session/lockscreen/lockscreen.component';

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
      {path: '', component: ParticipantsStructureComponent},
      {path: 'db', component: DatabaseViewComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/activities/teaching/list', component: TeachingActivityListComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/activities/evaluation/list', component: EvaluationActivityListComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/activity/teaching/:id', component: TeachingActivityComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/activity/evaluation/:id', component: EvaluationActivityComponent, canActivate: [AuthGuard], data: {roles: ['admin']} },
      {path: 'admin/activities/load', component: ActivityLoadComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/user/add', component: UserCreateComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'admin/users/list', component: UserListComponent, canActivate: [AuthGuard], data: {roles: ['admin']}},
      {path: 'activities', component: ActivityComponent, canActivate: [AuthGuard], data: {roles: ['student', 'teacher']}},
      {path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
      {path: 'forbidden', component: AdminComponent},
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
