// **************************************************************************************************
// BACKGROUND:
// The Official Website maintains separate timetables for students, teachers, and rooms.
// Retrieving each of these timetables individually can be a time-consuming process.
// To tackle this issue, we have devised a strategy where we initially fetch students' timetables.
// Subsequently, we utilize this data to derive timetables for teachers and rooms.
// This approach significantly reduces the time required for data retrieval and minimizes the number
// of requests made to the official website.
// **************************************************************************************************

import TimetableDocType from "#/types/TimetableDocType";
import {WEEK_DAYS_NAME} from "#/constants";

/**
 * Computes the list of unique teachers from the provided timetables.
 * @param timetables The list of timetables to process.
 * @returns An array containing the unique teachers.
 */
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

/**
 * Computes the timetable for the given teacher from the provided timetables.
 * @param teacher The teacher for whom to compute the timetable.
 * @param timetables The list of timetables to process.
 * @returns The timetable for the specified teacher.
 */
export function computeTeacherTimetable(teacher: string, timetables: TimetableDocType[]) {
  const teacherTimetable: TimetableDocType = {
    updatedAt: new Date(),
    uid: teacher,
    timetable: {},
  };

  // Initialize timetable for each day of the week
  WEEK_DAYS_NAME.forEach((name) => {
    teacherTimetable.timetable[name] = [];
  });

  // Populate teacher's timetable
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

  // Sort lectures by start time
  WEEK_DAYS_NAME.forEach((day) => {
    teacherTimetable.timetable[day] = teacherTimetable.timetable[day].sort(
      (lhs, rhs) =>
        lhs.startTime.hours * 60 + lhs.startTime.minutes - (rhs.startTime.hours * 60 + rhs.startTime.minutes)
    );
  });

  return teacherTimetable;
}

/**
 * Computes the list of unique rooms from the provided timetables.
 * @param timetables The list of timetables to process.
 * @returns An array containing the unique rooms.
 */
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

/**
 * Computes the timetable for the given room from the provided timetables.
 * @param roomNo The room number for which to compute the timetable.
 * @param timetables The list of timetables to process.
 * @returns The timetable for the specified room.
 */
export function computeRoomTimetable(roomNo: string, timetables: TimetableDocType[]) {
  const roomTimetable: TimetableDocType = {
    updatedAt: new Date(),
    uid: roomNo,
    timetable: {},
  };

  // Initialize timetable for each day of the week
  WEEK_DAYS_NAME.forEach((name) => {
    roomTimetable.timetable[name] = [];
  });

  // Populate room's timetable
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

  // Sort lectures by start time
  WEEK_DAYS_NAME.forEach((day) => {
    roomTimetable.timetable[day] = roomTimetable.timetable[day].sort(
      (lhs, rhs) =>
        lhs.startTime.hours * 60 + lhs.startTime.minutes - (rhs.startTime.hours * 60 + rhs.startTime.minutes)
    );
  });

  return roomTimetable;
}
