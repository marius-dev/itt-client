import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const roles = route.data['roles'] as Array<string>;
    // ['teacher', 'admin']
    if (!this.auth.authenticated) {
      this.router.navigate(['/login']);
      return Observable.of(false);
    }

    return this.auth.isAuthenticated(roles)
      .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/forbidden']);
        }
      });
  }
}

