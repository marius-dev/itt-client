import {Injectable} from '@angular/core';
import {TeachingActivity, Teacher, Semester, Subject, Participant} from "./calendar-metadata";
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class MetadataUtilService {

  constructor() {
  }


  serializedTeachingActivityToMetadata(serializedTeachingActivity): TeachingActivity {
    const activity = new TeachingActivity();

    activity.id = serializedTeachingActivity.id;
    activity.duration = serializedTeachingActivity.duration;
    activity.hour = serializedTeachingActivity.hour;
    activity.day = serializedTeachingActivity.day;
    activity.weekType = serializedTeachingActivity.weekType;
    activity.activityCategory = serializedTeachingActivity.activityCategory;
    activity.teacher = this.serializedTeacherToMetadata(serializedTeachingActivity.teacher);
    activity.subject = this.serializedSubjectToMetadata(serializedTeachingActivity.subject);
    activity.semester = this.serializedSemesterToMetadata(serializedTeachingActivity.semester);

    activity.participants = serializedTeachingActivity.participants.map(this.serializedParticipantToMetadata);


    return activity;
  }

  serializedTeacherToMetadata(serializedTeacher): Teacher {
    const teacher = new Teacher();
    teacher.id = serializedTeacher.id;
    teacher.surname = serializedTeacher.surname;
    teacher.name = serializedTeacher.name;
    teacher.email = serializedTeacher.email;

    return teacher;
  }

  serializedSemesterToMetadata(serielizedSemester): Semester {
    const semester = new Semester();
    semester.id = serielizedSemester.id;
    semester.number = serielizedSemester.number;
    semester.key = serielizedSemester.key;
    semester.academicYear = serielizedSemester.academicYear.name;
    semester.number = serielizedSemester.number;

    return semester;
  }

  serializedSubjectToMetadata(serielizedSubject): Subject {
    const subject = new Subject();
    subject.id = serielizedSubject.id;
    subject.description = serielizedSubject.description;
    subject.fullName = serielizedSubject.fullName;
    subject.shortName = serielizedSubject.shortName;

    return subject;
  }

  serializedParticipantToMetadata(serielizedParticipant): Participant {
    const participant = new Participant();
    participant.id = serielizedParticipant.id;
    participant.identifier = serielizedParticipant.identifier;
    participant.name = serielizedParticipant.name;
    participant.type = serielizedParticipant.type[0];

    return participant;
  }
}
