import {Injectable} from '@angular/core';

export interface ChildrenItems {
  state: string;
  name: string;
  type?: string;
  icon?: string;
  roles?: string[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  roles?: string[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: '/admin',
    name: 'ADMIN',
    type: 'sub',
    icon: 'group',
    roles: ['admin'],
    children: [
      {state: '/admin/activities/load', name: 'LOAD_ACTIVITIES', roles: ['admin']},
      {state: '/admin/activities/teaching/list', name: 'TEACHING_ACTIVITIES_LIST', roles: ['admin']},
      {state: '/admin/activities/evaluation/list', name: 'EVALUATION_ACTIVITIES_LIST', roles: ['admin']},
      {state: '/admin/user/add', name: 'ADD_USER', icon: 'group_add', roles: ['admin']},
      {state: '/admin/users/list', name: 'LIST_USERS', icon: 'list_view', roles: ['admin']}
    ]
  },
  {
    state: '/participant/activities',
    name: 'PARTICIPANTS_ACTIVITIES',
    type: 'link',
    icon: 'bubble_chart'
  },
  {
    state: '/activities',
    name: 'ACTIVITIES',
    type: 'link',
    icon: 'date_range',
    roles: ['student', 'teacher']
  },
  {
    state: '/location/activities',
    name: 'LOCATION_ACTIVITIES',
    type: 'link',
    icon: 'place'
  },
  {
    state: '/subject/activities',
    name: 'SUBJECT_ACTIVITIES',
    type: 'link',
    icon: 'assignment'
  },
  {
    state: '/teacher/activities',
    name: 'TEACHER_ACTIVITIES',
    type: 'link',
    icon: 'business_center'
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
