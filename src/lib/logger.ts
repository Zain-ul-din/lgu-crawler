import TimetableDocType from "../types/TimetableDocType";
import pc from "picocolors";

/**
 * Wrapper around console.log to print prettier output on console
 * @param timetable
 */
export function logOnCrawlTimetable(timetable: TimetableDocType) {
  console.log(`🎯 ${pc.cyan("successfully crawled")} ${pc.magenta(timetable.uid)}`);
}
