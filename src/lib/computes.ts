import TimetableDocType from "../types/TimetableDocType";
import {WEEK_DAYS_NAME} from "../constants";

export function computeTeachers(timetables: TimetableDocType[]) {
  const teachers = timetables
    .map(({timetable}) => {
      return Object.values(timetable)
        .map((v) => v.map(({teacher}) => teacher))
        .reduce((acc, curr) => acc.concat(curr), []);
    })
    .reduce((acc, curr) => acc.concat(curr), []);

  return Array.from(new Set(teachers));
}

export function computeTeacherTimetable(teacher: string, timetables: TimetableDocType[]) {
  const teacherTimetable: TimetableDocType = {
    updatedAt: new Date(),
    uid: teacher,
    timetable: {},
  };

  WEEK_DAYS_NAME.forEach((name) => {
    teacherTimetable.timetable[name] = [];
  });

  timetables.forEach(({uid, timetable}) => {
    Object.entries(timetable).forEach(([day, lectures]) => {
      lectures.forEach((lecture) => {
        if (lecture.teacher !== teacher) return;
        teacherTimetable.timetable[day].push({
          class: uid,
          ...lecture,
        });
      });
    });
  });

  // sorts lectures
  WEEK_DAYS_NAME.forEach((day) => {
    teacherTimetable.timetable[day] = teacherTimetable.timetable[day].sort(
      (lhs, rhs) =>
        lhs.startTime.hours * 60 + lhs.startTime.minutes - (rhs.startTime.hours * 60 + rhs.startTime.minutes)
    );
  });

  return teacherTimetable;
}

export function computeRooms(timetables: TimetableDocType[]) {
  const rooms = timetables
    .map(({timetable}) => {
      return Object.values(timetable)
        .map((v) => v.map(({roomNo}) => roomNo))
        .reduce((acc, curr) => acc.concat(curr), []);
    })
    .reduce((acc, curr) => acc.concat(curr), []);

  return Array.from(new Set(rooms));
}

export function computeRoomTimetable(roomNo: string, timetables: TimetableDocType[]) {
  const roomTimetable: TimetableDocType = {
    updatedAt: new Date(),
    uid: roomNo,
    timetable: {},
  };

  WEEK_DAYS_NAME.forEach((name) => {
    roomTimetable.timetable[name] = [];
  });

  timetables.forEach(({uid, timetable}) => {
    Object.entries(timetable).forEach(([day, lectures]) => {
      lectures.forEach((lecture) => {
        if (lecture.roomNo !== roomNo) return;
        roomTimetable.timetable[day].push({
          class: uid,
          ...lecture,
        });
      });
    });
  });

  // sorts lectures
  WEEK_DAYS_NAME.forEach((day) => {
    roomTimetable.timetable[day] = roomTimetable.timetable[day].sort(
      (lhs, rhs) =>
        lhs.startTime.hours * 60 + lhs.startTime.minutes - (rhs.startTime.hours * 60 + rhs.startTime.minutes)
    );
  });

  return roomTimetable;
}
