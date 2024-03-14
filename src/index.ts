import { ERRORS } from "./constants";
import Worker from "./lib/worker";
import TimetableRepository from "./lib/TimetableRepository";

new Worker()

.onCrawlMetaData(({metaData,  timeTableRequestPayloads}) => {
  if(timeTableRequestPayloads.length == 0) throw ERRORS.INVALID_COOKIE;
  TimetableRepository.writeMetaData(metaData)
})

.onFinish((allTimetables) => TimetableRepository
  .writeTimetables(allTimetables)
  .writeTeachersTimetable(allTimetables)
  .writeRoomsTimetable(allTimetables)
)

.start();
