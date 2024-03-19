import TimetableDocType from "../types/TimetableDocType";
import pc from "picocolors";

export function logOnCrawlTimetable(timetable: TimetableDocType) {
  console.log(`🎯 ${pc.cyan("successfully crawled")} ${pc.magenta(timetable.uid)}`);
}
