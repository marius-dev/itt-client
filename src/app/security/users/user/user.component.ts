import {User} from '../user';
import {MdDialog, MdDialogRef} from '@angular/material';
import {fadeInAnimation} from '../../../core/route-animation/route.animation';
import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[@fadeInAnimation]': 'true'
  },
  animations: [fadeInAnimation]
})
export class UserComponent implements OnInit {

  @Input()
  user: User;

  @Output()
  deleteUserEvent = new EventEmitter<User>();

  validateDelete: boolean;

  dialogRef: MdDialogRef<AskForUserRemovalComponent>;


  constructor(public dialog: MdDialog) {
  }

  ngOnInit() {
  }

  deleteValidation(value: boolean) {
    this.validateDelete = value;
  }

  openDialog() {
    this.dialogRef = this.dialog.open(AskForUserRemovalComponent, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case 'nu': break;
        case 'da' : this.delete(); break;
      }
      this.dialogRef = null;
    });
  }

  delete() {
    this.validateDelete = false;
    this.deleteUserEvent.emit(this.user);
  }

}


@Component({
  selector: 'app-dialog1',
  template: `
    <h1>Sunteti sigur ca doriti sa stergeti acest utilizator</h1>

    <md-dialog-actions align="end">
      <button md-button (click)="dialogRef.close('nu')">No</button>
      <button md-button color="primary" (click)="dialogRef.close('da')">Yes</button>
    </md-dialog-actions>
  `
})
export class AskForUserRemovalComponent {
  constructor(public dialogRef: MdDialogRef<AskForUserRemovalComponent>) {
  }
}
