import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {AdminComponent} from './admin/admin.component';
import {LockScreenComponent} from './session/lockscreen/lockscreen.component';
import {ForgotPasswordComponent} from './session/forgot-password/forgot-password.component';
import {LoginComponent} from './session/login/login.component';

const appRoutes: Routes = [
  {
    path: 'session/login',
    component: LoginComponent,
  }, {
    path: 'session/forgot-password',
    component: ForgotPasswordComponent,
  }, {
    path: 'session/lockscreen',
    component: LockScreenComponent,
  }, {
    path: '',
    component: MainComponent,
    children: []
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
