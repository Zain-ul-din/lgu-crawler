import {ERRORS} from "./constants";
import Worker from "./lib/worker";
import TimetableRepository from "./lib/TimetableRepository";
import {logOnCrawlTimetable} from "./lib/logger";

new Worker()

  /* 
  Callback invoked when metadata is available 
*/
  .onCrawlMetaData(({metaData, timeTableRequestPayloads}) => {
    if (timeTableRequestPayloads.length == 0) throw ERRORS.INVALID_COOKIE;
    TimetableRepository.writeMetaData(metaData);
  })

  /* 
  Callback invoked when timetable is crawled
*/
  .onCrawlTimetable(logOnCrawlTimetable)

  /* 
  Callback invoked when all timetables are crawled
*/
  .onFinish((allTimetables) =>
    TimetableRepository.writeTimetables(allTimetables)
      .writeTeachersTimetable(allTimetables)
      .writeRoomsTimetable(allTimetables)
  )

  // start the worker 🔥
  .start();
