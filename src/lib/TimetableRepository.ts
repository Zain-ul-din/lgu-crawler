import {writeDB} from "../local-db";
import {hashStr} from "../local-db/cipher";
import MetaDataType from "../types/MetaDataType";
import TimetableDocType from "../types/TimetableDocType";
import {computeRoomTimetable, computeRooms, computeTeacherTimetable, computeTeachers} from "./computes";
import {isJsonString} from "./util";
import {WEEK_DAYS_NAME} from "../constants";
import TimetableType from "../types/TimetableType";

class TimetableRepository {
  public static writeMetaData(metaData: MetaDataType) {
    writeDB("meta_data", metaData, {hash: false});
  }

  public static writeTimetables(timetables: TimetableDocType[]) {
    writeDB("all_timetables", timetables, {hash: false});
    writeDB("timetable_paths", timetables.map((t) => t.uid).map(hashStr), {hash: false});

    const timetableSnapShot = timetables.map((timetable) =>
      writeDB(timetable.uid, timetable, {
        compare: TimetableRepository.compareDBTimetable,
      })
    );
    const newTimetableChanges = timetableSnapShot.filter(({similarity}) => similarity === "different");
    writeDB(
      "timetables_new_changes",
      newTimetableChanges.map(({content}) => hashStr(content.uid)),
      {hash: false}
    );

    return this;
  }

  public static writeTeachersTimetable(timetables: TimetableDocType[]) {
    const teachers = computeTeachers(timetables);
    writeDB("teachers", teachers, {hash: false});
    writeDB("teacher_paths", teachers.map(hashStr), {hash: false});

    const teachersSnapShot = teachers.map((teacher) =>
      writeDB(teacher, computeTeacherTimetable(teacher, timetables), {
        compare: TimetableRepository.compareDBTimetable,
      })
    );
    const teacherNewChanges = teachersSnapShot.filter(({similarity}) => similarity === "different");
    writeDB(
      "teachers_new_changes",
      teacherNewChanges.map(({content}) => hashStr(content.uid)),
      {hash: false}
    );

    return this;
  }

  public static writeRoomsTimetable(timetables: TimetableDocType[]) {
    const rooms = computeRooms(timetables);
    writeDB("rooms", rooms, {hash: false});
    writeDB("rooms_paths", rooms.map(hashStr), {hash: false});

    const roomsSnapShot = rooms.map((room) =>
      writeDB(room, computeRoomTimetable(room, timetables), {
        compare: TimetableRepository.compareDBTimetable,
      })
    );
    const roomsNewChanges = roomsSnapShot.filter(({similarity}) => similarity == "different");
    writeDB(
      "rooms_new_changes",
      roomsNewChanges.map(({content}) => hashStr(content.uid)),
      {hash: false}
    );

    return this;
  }

  private static compareDBTimetable(curr: TimetableDocType, dbContent: string) {
    if (!isJsonString(dbContent)) return false;
    const timetable = JSON.parse(dbContent) as any;
    if (!Object.hasOwn(timetable, "timetable" as keyof TimetableDocType)) return false;
    return (
      JSON.stringify(TimetableRepository.removeSameTimingLectures(curr.timetable)) ===
      JSON.stringify(TimetableRepository.removeSameTimingLectures((timetable as TimetableDocType).timetable))
    );
  }

  /**
   * Helper method to remove same timing lectures.
   * On the Official Website we have scenario where one teacher have two lecture at a same time
   * @param timetable
   */
  private static removeSameTimingLectures(timetable: TimetableType) {
    WEEK_DAYS_NAME.forEach((week) => {
      timetable[week] = timetable[week].filter((lecture, idx, self) => {
        return !self
          .slice(idx + 1)
          .some(
            (other) =>
              other.startTime.hours === lecture.startTime.hours &&
              other.startTime.minutes === lecture.startTime.minutes &&
              other.endTime.hours === lecture.endTime.hours &&
              other.endTime.minutes === lecture.endTime.minutes
          );
      });
    });
  }
}

export default TimetableRepository;
