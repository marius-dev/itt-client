import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Role} from './role';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class RoleService {

  constructor(private afDatabase: AngularFireDatabase) {}

  getRoles(): Observable<Role[]> {
    return this.afDatabase.list('roles');
  }
}
