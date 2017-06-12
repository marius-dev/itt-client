import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {environment} from '../../environments/environment';
import {AngularFireModule} from 'angularfire2';

export const firebaseConfig  = environment.firebaseConfig;

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  declarations: []
})
export class SecurityModule { }
