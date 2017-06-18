import {Inject, Injectable} from '@angular/core';
import {FirebaseApp} from 'angularfire2';
import {ReplaySubject} from 'rxjs';
import {User} from '../users/user';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class UploadService {

  constructor(public afAuth: AngularFireAuth, public afDatabase: AngularFireDatabase,
              @Inject(FirebaseApp) private firebaseApp: any) {
  }

  uploadProfileImage(user, img) {
    // Create a root reference
    const storageRef = this.firebaseApp.storage().ref();

    const path = `/profile/${user.$key}`;
    const iRef = storageRef.child(path);
    iRef.putString(img, 'base64', {contentType: 'image/png'}).then((snapshot) => {
      console.log('Uploaded a blob or file! Now storing the reference at', `/profile/images/`);
      this.afDatabase.object(`users/${user.$key}/profile/image`).update({path: path, filename: user.$key});
    });
  }

  getProfileImage(user: User): ReplaySubject<any> {
    const resultSubject = new ReplaySubject(1);
    const storage = this.firebaseApp.storage();

    if (user != null) {
      this.afDatabase.object(`users/${user.$key}/profile/image`)
        .subscribe(image => {
          console.log('image', image);
          if (image.path != null) {
            console.log('one', image);
            const pathReference = storage.ref(image.path);
            pathReference.getDownloadURL().then(url => {
              const result = {image: url, path: image.path, filename: image.filename};
              console.log('two', result);
              resultSubject.next(result);
              // this.profileImage = result;
            });

          }
        });
    }

    return resultSubject;
  }


}
