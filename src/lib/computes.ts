import TimetableDocType from "../types/TimetableDocType";

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

  timetables.forEach(({uid, timetable}) => {
    Object.entries(timetable).forEach(([day, lectures]) => {
      lectures.forEach((lecture) => {
        if (lecture.teacher !== teacher) return;
        if (teacherTimetable.timetable[day] == undefined) teacherTimetable.timetable[day] = [];
        teacherTimetable.timetable[day].push({
          class: uid,
          ...lecture,
        });
      });
    });
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

  timetables.forEach(({uid, timetable}) => {
    Object.entries(timetable).forEach(([day, lectures]) => {
      lectures.forEach((lecture) => {
        if (lecture.roomNo !== roomNo) return;
        if (roomTimetable.timetable[day] == undefined) roomTimetable.timetable[day] = [];
        roomTimetable.timetable[day].push({
          class: uid,
          ...lecture,
        });
      });
    });
  });

  return roomTimetable;
}
