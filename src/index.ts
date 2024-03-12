import { hashStr } from "./lib/cipher";
import {computeRoomTimetable, computeRooms, computeTeacherTimetable, computeTeachers} from "./lib/computes";
import {writeDB} from "./lib/local-db";
import Worker from "./lib/worker";

const worker = new Worker();

worker.onCrawlMetaData(({metaData}) => {
  writeDB("meta_data", metaData, false);
  
  // add more services as needed
});

worker.onCrawlTimetable((timetable) => {
  writeDB(timetable.uid, timetable);

  // add more services as needed
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
  
  // add more services as needed
});

worker.start();
