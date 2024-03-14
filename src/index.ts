import { ERRORS } from "./constants";
import { hashStr } from "./local-db/cipher";
import {computeRoomTimetable, computeRooms, computeTeacherTimetable, computeTeachers} from "./lib/computes";
import Worker from "./lib/worker";
import { writeDB } from "./local-db";

const worker = new Worker();

worker.onCrawlMetaData(({metaData,  timeTableRequestPayloads}) => {
  if(timeTableRequestPayloads.length == 0) throw ERRORS.INVALID_COOKIE;
  writeDB("meta_data", metaData, false);
});

worker.onCrawlTimetable((timetable) => {
  writeDB(timetable.uid, timetable);
});

worker.onFinish((allTimetables) => {
  
  writeDB("all_timetables", allTimetables, false)
  writeDB("timetable_paths", allTimetables.map(t=> t.uid).map(hashStr), false)

  const teachers = computeTeachers(allTimetables);
  writeDB("teachers", teachers, false);
  teachers.forEach((teacher) => writeDB(teacher, computeTeacherTimetable(teacher, allTimetables)));
  writeDB("teacher_paths", teachers.map(hashStr), false)
  
  const rooms = computeRooms(allTimetables);
  writeDB("rooms", rooms, false);
  rooms.forEach((room) => writeDB(room, computeRoomTimetable(room, allTimetables)));
  writeDB("rooms_paths", rooms.map(hashStr), false)
  
});

worker.start();
