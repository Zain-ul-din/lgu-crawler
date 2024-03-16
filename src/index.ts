import { ERRORS } from "./constants";
import Worker from "./lib/worker";
import TimetableRepository from "./lib/TimetableRepository";
import { logOnCrawlTimetable } from "./lib/logger";

new Worker()

.onCrawlMetaData(({metaData,  timeTableRequestPayloads}) => {
  if(timeTableRequestPayloads.length == 0) throw ERRORS.INVALID_COOKIE;
  TimetableRepository.writeMetaData(metaData)
})

.onCrawlTimetable(logOnCrawlTimetable)

.onFinish((allTimetables) => TimetableRepository
  .writeTimetables(allTimetables)
  .writeTeachersTimetable(allTimetables)
  .writeRoomsTimetable(allTimetables)
)

.start();
