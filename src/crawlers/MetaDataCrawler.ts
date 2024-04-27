import Crawler from "./Crawler";
import Parser from "../parsers/Parser";
import HTMLOptionsType from "../types/HTMLOptionsType";
import MetaDataType from "../types/MetaDataType";
import TimetableRequestPayload from "../types/TimetableRequestPayload";
import {promisify} from "../lib/util";

interface MetaDataCrawlerParams {
  parser: Parser<HTMLOptionsType>;
}

/**
 * Abstract type that will return from MetadataCrawler
 */
export interface MetaDataCrawlerReturnType {
  metaData: MetaDataType;
  timeTableRequestPayloads: TimetableRequestPayload[];
}

/**
 * MetaDataCrawler responsible for scrapping drop downs data from the targeted website.
 * @description It's called metadata since metadata is `a set of data that describes and gives information about other data`.
 * In this case, it is describing about the timetable data.
 */
class MetaDataCrawler extends Crawler<MetaDataCrawlerReturnType> {
  /**
   * Semesters page endpoint
   * @returns static html page
   *
   * @todo
   *  - parse html
   *  - target selector `#semester option`
   */
  private static readonly SEMESTERS_ENDPOINT = `https://timetable.lgu.edu.pk/Semesters/Semester_pannel.php`;

  /**
   * Programs API endpoint
   * @returns html options list
   *
   * @todo
   *  - target selector `option`
   */
  private static readonly PROGRAMS_ENDPOINT = `https://timetable.lgu.edu.pk/Semesters/ajax.php`;

  /**
   * parses HTMLOption tag from html
   */
  private optsParser: Parser<HTMLOptionsType>;
  private metaData: MetaDataType;
  private timeTableRequestPayloads: TimetableRequestPayload[];

  /**
   * Creates an instance of meta data crawler.
   * @param {parser} HTMLOption parser
   */
  public constructor({parser}: MetaDataCrawlerParams) {
    super();
    this.optsParser = parser;
    this.metaData = {};
    this.timeTableRequestPayloads = [];
  }

  /**
   * Crawls all required endpoints to fetch metadata
   * @description subtribe `instance.on('crawl')` to get scrapped data
   * ### How this Work?
   * - fetch semesters
   * - sends semester in payload to get programs
   * - sends both semester and program to get sections
   * - eventually construct metadata from fetched data which later use to create timetable fetch request payload
   */
  public async crawl() {
    const {textNodes: semesters} = await this.fetchSemesters();
    this.metaData = Object.fromEntries(semesters.map((s) => [s, {}]));
    await promisify(semesters.map(this.processPrograms.bind(this)));
    this.event.emit(Crawler.ON_CRAWL, {
      metaData: this.metaData,
      timeTableRequestPayloads: this.timeTableRequestPayloads,
    } as MetaDataCrawlerReturnType);
  }

  /**
   * A helper method to process programs manipulation
   * @param semester semester option value | textContent
   */
  private async processPrograms(semester: string) {
    const {values, textNodes} = await this.fetchPrograms(semester);
    this.metaData[semester] = Object.fromEntries(textNodes.map((p) => [p, []]));
    return await promisify(textNodes.map(async (program, i) => this.processSections(semester, program, values[i])));
  }

  /**
   * A helper method to process sections manipulation
   * @param semester semester option value | textContent
   * @param program program textContent. use inside metadata for human readability
   * @param programId program option value. use to construct request payload
   *  since official apis accepts id rather then textContent
   */
  private async processSections(semester: string, program: string, programId: string) {
    const sections = await this.fetchSections(semester, programId);
    this.metaData[semester][program] = sections.textNodes;
    sections.textNodes.forEach((section, i) => {
      this.timeTableRequestPayloads.push({semester, program, programId, section, sectionId: sections.values[i]});
    });
  }

  /**
   * Fetchs initial semesters
   * @returns HTML Options
   */
  private async fetchSemesters() {
    const res = await this.fetchContent(MetaDataCrawler.SEMESTERS_ENDPOINT);
    return this.optsParser.parse(res, "#semester option");
  }

  /**
   * Fetchs programs
   * @param semester semester option value or semester textContent both are acceptable in payload
   * @returns HTML Options
   */
  private async fetchPrograms(semester: string) {
    const res = await this.fetchContent(MetaDataCrawler.PROGRAMS_ENDPOINT, {
      method: "POST",
      body: `semester=${semester}`,
    });
    return this.optsParser.parse(res, "option");
  }

  /**
   * Fetchs sections
   * @param semester semester option value or semester textContent both are acceptable in payload
   * @param programId program option value
   * @returns HTML Options
   */
  private async fetchSections(semester: string, programId: string) {
    const res = await this.fetchContent(MetaDataCrawler.PROGRAMS_ENDPOINT, {
      method: "POST",
      body: `program=${programId}&semester=${semester}`,
    });
    return this.optsParser.parse(res, "option");
  }
}

export default MetaDataCrawler;
