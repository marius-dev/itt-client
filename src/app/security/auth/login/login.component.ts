import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';
import {AuthUser} from '../auth-user';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  loginError: string;
  request: Subscription;
  tryingToLogIn: boolean;

  constructor(private router: Router,
              private auth: AuthService) {
  }

  ngOnInit() {
    if (this.auth.authenticated === true) {
      this.router.navigate(['/']);
    }
  }

  login(user: AuthUser) {
    this.tryingToLogIn = true;
    if (this.request) {
      this.request.unsubscribe();
    }
    this.request = this.auth
      .login(user.email, user.password)
      .subscribe(
        // Is the data
        (lUser) => {
          if (lUser) {
            this.loginError = null;
            this.router.navigate(['/']).then(() => {
            });
          } else {
            this.loginError = 'username and password was wrong';
          }
        },
        // Error handling
        (err) => {
          this.loginError = 'An error occoured during login-view, see error in console';
          this.tryingToLogIn = false;
        },
        // Observable Done
        () => {
          this.tryingToLogIn = false;
        }
      );
  }


  ngOnDestroy() {
    if (this.request) {
      this.request.unsubscribe();
    }
  }

}
