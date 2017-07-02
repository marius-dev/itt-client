import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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

  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService) {
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.auth.authenticated === true) {
      this.router.navigateByUrl(this.returnUrl);
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
        (lUser) => {
          if (lUser) {
            this.loginError = null;
            this.router.navigateByUrl(this.returnUrl).then(() => {
            });
          } else {
            this.loginError = 'username and password was wrong';
          }
        },
        // Error handling
        (err) => {
          this.loginError = err.toString();
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
