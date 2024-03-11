import Parser from "../parsers/Parser";
import TimetableRequestPayload from "../types/TimetableRequestPayload";
import TimetableType from "../types/TimetableType";
import Crawler from "./Crawler";

interface TimetableCrawlerParams {
  timetableParser: Parser<TimetableType>;
}

interface TimetableCrawlerReturnType {
  updatedAt: Date;
  uid: string;
  timetable: TimetableType;
}

class TimetableCrawler extends Crawler<TimetableCrawlerReturnType> {
  private static readonly END_POINT = `https://timetable.lgu.edu.pk/Semesters/semester_info/SEMESTER_TIMETABLE.php`;

  private timetableParser: Parser<TimetableType>;

  public constructor({timetableParser}: TimetableCrawlerParams) {
    super();
    this.timetableParser = timetableParser;
  }

  public async crawl({semester, section, program, sectionId, programId}: TimetableRequestPayload) {
    const res = await this.fetchContent(TimetableCrawler.END_POINT, {
      method: "POST",
      body: `semester=${semester}&section=${sectionId}&program=${programId}`,
    });

    this.event.emit(Crawler.ON_CRAWL, {
      updatedAt: new Date(),
      uid: `${semester} ${program} ${section}`.replaceAll("/", ""),
      timetable: this.timetableParser.parse(res),
    } as TimetableCrawlerReturnType);
  }
}

export default TimetableCrawler;
