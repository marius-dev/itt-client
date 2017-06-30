import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, canRedirect: boolean = true): Observable<boolean> {
    const roles = route.data['roles'] as Array<string>;

    if (localStorage.getItem('currentUser')) {
      console.log('in cache');
      return Observable.of(true);
    }

    if (!this.auth.authenticated) {
      if (canRedirect) {
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      }
      return Observable.of(false);
    }

    return this.auth.isAuthenticated(roles)
      .do(authenticated => {
        if (!authenticated) {
          if (canRedirect) {
            this.router.navigate(['/forbidden']);
          }
          return Observable.of(false);
        }else {
          return Observable.of(true);
        }
      });
  }
}

