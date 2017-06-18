import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {AuthUser} from '../../auth/auth-user';

@Component({
   selector: 'app-login-view-component',
   templateUrl: './login-view.component.html',
   styleUrls: ['./login-view.component.scss'],
   encapsulation: ViewEncapsulation.None,
})
export class LoginViewComponent implements OnInit {
  user: AuthUser;

  @Input()
  signInError: string;
  @Input()
  tryingToLogIn: boolean;

  @Output('login')
  tryLoginEmitter = new EventEmitter<AuthUser>();

  tryLogin() {
    this.tryLoginEmitter.emit(this.user);
  }

  constructor() {
    this.user = new AuthUser();
  }

  ngOnInit() {
  }
}



