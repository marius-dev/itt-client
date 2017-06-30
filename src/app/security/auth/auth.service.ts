import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../users/user';
import {UserService} from '../users/user.service';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';
import {any} from 'codelyzer/util/function';

@Injectable()
export class AuthService {

  authState: any = null;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService) {

    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth;
    });
  }

  login(email, password): Observable<any> {
    const promise = this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return Observable.fromPromise(promise);
  }

  currentUser(): Observable<User> {
    if (this.authenticated === true) {
      return this.userService.getUser(this.currentUserId);
    } else {
      this.loadCurrentUser();
      return Observable.of(null);
    }
  }

  isAuthenticated(roles: string[]): Observable<boolean> {
    return this.currentUser()
      .switchMap(user =>
        roles ?
          Observable.of(!!user && roles.indexOf(user.role.name) > -1) :
          Observable.of(!!user)
      );
  }

  logout(): Observable<void> {
    const promise = this.afAuth.auth.signOut();
    return Observable.fromPromise(promise);
  }


  // Returns
  get currentUserObservable(): any {
    return this.authenticated ? this.authState : null;
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : '';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.currentUserObservable.isAnonymous : false;
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }
}
