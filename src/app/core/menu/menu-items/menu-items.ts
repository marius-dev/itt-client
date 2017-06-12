import { Injectable } from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'calendar',
    name: 'CALENDAR',
    type: 'link',
    icon: 'date_range'
  },
  {
    state: 'session',
    name: 'SESSIONS',
    type: 'sub',
    icon: 'face',
    children: [
      {state: 'login', name: 'LOGIN'},
      {state: 'register', name: 'REGISTER'},
      {state: 'forgot-password', name: 'FORGOT'},
      {state: 'lockscreen', name: 'LOCKSCREEN'}
    ]
  }

];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }
  add(menu: Menu) {
    MENUITEMS.push(menu);
  }
}
