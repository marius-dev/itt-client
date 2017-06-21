/**
 * Created by ilies on 21-Jun-17.
 */

export class TeachingActivity {
  id: number;
  duration: number;
  hour: number;
  activityCategory: string;
  weekType: string;
  day: number;

  semester: Semester;
  teacher: Teacher;
  subject: Subject;
  participants: Participant[];
}

export class Semester {
  id: number;
  number: number;
  key: string;
  academicYear: string;
}

export class Teacher {
  id: number;
  surname: string;
  name: string;
  email: string;
}

export class Subject {
  id: number;
  shortName: string;
  description: string;
  fullName: string;
}

export class Participant {
  id: number;
  identifier: string;
  name: string;
  yearOfStudy: number;
  type: string;
}
