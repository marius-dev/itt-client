
export class TeachingActivity {
  id: number;
  duration: number;
  hour: number;
  activityCategory: string;
  weekType: string;
  day: number;

  semester: Semester;
  location: Location;
  teacher: Teacher;
  subject: Subject;
  participants: Participant[];
}

export class EvaluationActivity {
  id: number;
  duration: number;
  hour: number;
  activityCategory: string;
  date: Date;

  academicYear: string;
  location: Location;
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

export class Specialization {
  id: number;
  identifier: string;
  fullName: string;
  shortName: string;
  specializationCategory: string;


  constructor(fullName: string) {
    this.fullName = fullName;
  }
}

export class Location {
  id: number;
  fullName: string;
  shortName: string;
}

