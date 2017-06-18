import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../user';
import {Profile} from '../profile';
import {AuthService} from '../../auth/auth.service';
import {MdSnackBar} from '@angular/material';
import {CropperSettings} from 'ng2-img-cropper';
import {UploadService} from '../../storage/upload.service';
// data.image.split(/,(.+)/)[1]

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  data: any;
  cropperSettings: CropperSettings;

  changingImage: boolean;
  initialProfile: Profile;
  user: User;


  userDisplayName: string;

  error: string;

  constructor(private userService: UserService,
              private uploadService: UploadService,
              private auth: AuthService,
              public updateValidationBar: MdSnackBar) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;

    this.data = {};

    this.userDisplayName = '';

    this.changingImage = false;
    this.user = new User();
    this.user.profile = new Profile();
    this.user.profile.displayName = '';
  }

  ngOnInit() {
    const sub = this.auth.currentUser().subscribe(user => {
      this.user = user;
      this.userDisplayName = user.profile.displayName;

      this.uploadService.getProfileImage(user).subscribe(image => {
        this.data = image;
      });

      if (sub != null) {
        sub.unsubscribe();
      }
    });
  }

  cloneInitial(profile: Profile) {
    this.initialProfile = Object.assign(new Profile(), profile);
  }

  onSubmit(userProfileForm) {
    if (userProfileForm.form.valid) {
      this.updateProfile();
    } else {
      this.error = userProfileForm.form.errors.toString();
    }
  }

  updateProfile() {
    this.user.profile.displayName = this.userDisplayName;
    const sub = this.userService.updateUserProfile(this.user)
      .subscribe(user => {
          this.cloneInitial(user.profile);
          this.updateValidationBar.open('User created');
        },
        err => {
          this.error = err.message;
        },
        () => {
          sub.unsubscribe();
        });
  }

  profileIsChanged() {
    if (this.user.profile !== null) {
      return false;
    }

    return this.user.profile.displayName !== this.initialProfile.displayName
      || this.user.profile.email !== this.initialProfile.email;
  }

  changingImageClick() {
    this.changingImage = true;
  }

  changingImageClickFalse() {
    this.changingImage = false;
  }

  saveNewImage() {
    if (this.data && this.data.image) {
      this.uploadService.uploadProfileImage(this.user, this.data.image.split(/,(.+)/)[1]);
    }
    this.changingImage = false;
  }

}
