import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {User} from '../user';
import {RoleService} from '../../roles/role.service';
import {ObservableMedia} from '@angular/flex-layout';
import {Role} from '../../roles/role';
import {Observable, Subscription} from 'rxjs';
import {UserService} from '../user.service';
import {AuthService} from '../../auth/auth.service';
import {Profile} from '../profile';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit, OnDestroy {

  @Input()
  creatingUser: boolean;
  @Input()
  user: User;
  @Input()
  error: string;

  roles: Role[];
  sub: Subscription;

  constructor(private rs: RoleService, private as: AuthService, private us: UserService) {
  }

  ngOnInit() {
    this.sub = this.rs.getRoles().subscribe(roles => {
      this.roles = roles;
    });

    this.user = this.getNulledUser();
  }

  ngOnDestroy() {
    if (this.sub !== null) {
      this.sub.unsubscribe();
    }
  }

  onSubmit(userForm) {
    if (userForm.form.valid) {
      this.createUser(this.user);
    }
  }

  getNulledUser() {
    const user = new User;
    user.profile = new Profile();

    return user;
  }

  createUser(user) {
    this.us.createUser(user)
      .subscribe(user => {
          this.error = null;
          // store to graph database
          this.user = new User();
        },
        err => {
          this.error = err.message;
        });
  }

}
