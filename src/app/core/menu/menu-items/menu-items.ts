import {Injectable} from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  icon?: string;
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
    state: 'admin',
    name: 'ADMIN',
    type: 'sub',
    icon: 'group',
    children: [
      {state: '/admin/activities/load', name: 'LOAD_ACTIVITIES'},
      {state: '/admin/activities/teaching/list', name: 'TEACHING_ACTIVITIES_LIST'},
      {state: '/admin/activities/evaluation/list', name: 'EVALUATION_ACTIVITIES_LIST'},
      {state: '/admin/user/add', name: 'ADD_USER', icon: 'group_add'},
      {state: '/admin/users/list', name: 'LIST_USERS', icon: 'list_view'}
    ]
  },
  {
    state: 'activities',
    name: 'ACTIVITIES',
    type: 'link',
    icon: 'date_range'
  },
  {
    state: 'session',
    name: 'SESSIONS',
    type: 'sub',
    icon: 'face',
    children: [
      {state: '/login', name: 'LOGIN'},
      {state: '/register', name: 'REGISTER'},
      {state: '/forgot-password', name: 'FORGOT'},
      {state: '/lockscreen', name: 'LOCKSCREEN'}
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
