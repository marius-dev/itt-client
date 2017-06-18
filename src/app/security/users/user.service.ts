import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {User} from './user';
const firebase = require('firebase');

import {environment} from '../../../environments/environment';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

const firebaseConfig = environment.firebaseConfig;

@Injectable()
export class UserService {

  app;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {
  }

  getUsers(): Observable<User[]> {
    return this.afDatabase.list('users');
  }

  getUser($key: string): Observable<User> {
    return this.afDatabase.object('users/' + $key);
  }

  createUser(user: User): ReplaySubject<any> {
    const resultSubject = new ReplaySubject(1);

    if (!this.app) {
      this.app = firebase.initializeApp(firebaseConfig, 'demo');
    }

    this.app.auth().createUserWithEmailAndPassword(user.profile.email, user.password)
      .then(fbAuth => {
        const updatedUserData = {};
        updatedUserData[`roles/${user.role.$key}/users/${fbAuth.uid}`] = true;
        updatedUserData[`users/${fbAuth.uid}`] = {
          profile: {
            email: user.profile.email
          },
          role: {
            id: user.role.$key,
            name: user.role.name
          }
        };
        this.afDatabase.object('/').update(updatedUserData)
          .then(() => {
            resultSubject.next(user);
            console.log(user);
          })
          .catch(err => {
            console.log(err);
            resultSubject.error(err);
          });
      })
      .catch(err => {
        resultSubject.error(err);
      });
    return resultSubject;
  }

  updateUserProfile(user: User): Observable<User> {
    const resultSubject = new ReplaySubject(1);
    if (user !== undefined &&
      user.$key !== undefined) {
      const dataToUpdate = {};
      dataToUpdate[`users/${user.$key}/profile/displayName`] =
        user.profile.displayName;
      // dataToUpdate[`users/${user.$key}/profile/email`] = user.profile.email;
      this.afDatabase.object('/')
        .update(dataToUpdate)
        .then(() => {
          resultSubject.next(user);
          resultSubject.complete();
        })
        .catch(err => {
          resultSubject.error(err);
          resultSubject.complete();
        });
    }
    return resultSubject;
  }

  deleteUser(user: User): ReplaySubject<any> {
    const resultSubject = new ReplaySubject(1);
    if (user !== undefined && user.$key !== undefined) {
      const dataToDelete = {};
      dataToDelete[`users/${user.$key}`] = null;
      dataToDelete[`roles/${user.role.id}/users/${user.$key}`] = null;
      this.afDatabase.object('/').update(dataToDelete)
        .then(() => {
          resultSubject.next(user);
        })
        .catch(err => {
          resultSubject.error(err);
        });
    }
    
    return resultSubject;
  }
}
