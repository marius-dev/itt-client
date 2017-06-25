import {Injectable} from '@angular/core';
import {TeachingActivity, Teacher, Semester, Subject, Participant, Location, EvaluationActivity} from './calendar-metadata';


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
    activity.location = this.serializedLocationToMetadata(serializedTeachingActivity.location);
    activity.teacher = this.serializedTeacherToMetadata(serializedTeachingActivity.teacher);
    activity.subject = this.serializedSubjectToMetadata(serializedTeachingActivity.subject);
    activity.semester = this.serializedSemesterToMetadata(serializedTeachingActivity.semester);

    activity.participants = serializedTeachingActivity.participants.map(this.serializedParticipantToMetadata);


    return activity;
  }

  serializedEvaluationActivityToMetadata(serializedEvaluationActivity): EvaluationActivity {
    const activity = new EvaluationActivity();


    activity.id = serializedEvaluationActivity.id;
    activity.duration = serializedEvaluationActivity.duration;
    activity.hour = serializedEvaluationActivity.hour;
    activity.date = serializedEvaluationActivity.date;
    activity.activityCategory = serializedEvaluationActivity.activityCategory;
    activity.location = this.serializedLocationToMetadata(serializedEvaluationActivity.location);
    activity.teacher = this.serializedTeacherToMetadata(serializedEvaluationActivity.teacher);
    activity.subject = this.serializedSubjectToMetadata(serializedEvaluationActivity.subject);
    activity.academicYear = serializedEvaluationActivity.academicYear;

    activity.participants = serializedEvaluationActivity.participants.map(this.serializedParticipantToMetadata);


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

  serializedLocationToMetadata(serializedLocation): Location {
    const location = new Location();
    location.id = serializedLocation.id;
    location.fullName = serializedLocation.fullName;
    location.shortName = serializedLocation.shortName;

    return location;
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
