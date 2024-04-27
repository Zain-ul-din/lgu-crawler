import { Worker, TimetableRepository, logOnCrawlTimetable } from "#/lib";
import { ERRORS } from "#/constants";

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
