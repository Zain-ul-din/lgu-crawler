import {load, Element, CheerioAPI} from "cheerio/lib/slim";
import Parser from "./Parser";

/**
 * Parsers timetable data from HTML content.
 */
class TimetableParser extends Parser {
  /**
   * Parses timetable data from raw HTML content.
   * @param rawContent The raw HTML content to parse.
   * @param selector The CSS selector to locate timetable rows.
   * @returns Parsed timetable data.
   */
  public parse(rawContent: string, selector: string = "tr") {
    const $ = load(rawContent);
    const rows = $("tr").toArray().slice(1);

    const timetable = rows
      .map((row) => this.parseRow($, row))
      .reduce((acc: {}, curr) => {
        const [entry] = Object.entries(curr);
        return {...acc, [entry[0]]: entry[1]};
      }, {});
    return timetable;
  }

  /**
   * Parses a single timetable row.
   * @param $ The Cheerio instance.
   * @param row The row element to parse.
   * @returns Parsed timetable data for the row.
   */
  private parseRow($: CheerioAPI, row: Element) {
    const weekName = $(row).find("th").text();
    const tdNodes = $(row).find("td").toArray();

    const lectures = tdNodes
      .filter((node) => $(node).text().trim() !== "X" && $(node).text().trim() !== "All slots are free")
      .map((node) => {
        const textNodes = $(node)
          .find("span")
          .toArray()
          .map((ele) => $(ele).text().trim());
        return this.parseTextNodes(textNodes);
      })
      .sort(
        (lhs, rhs) =>
          lhs.startTime.hours * 60 + lhs.startTime.minutes - (rhs.startTime.hours * 60 + rhs.startTime.minutes)
      );

    return {[weekName]: lectures};
  }

  /**
   * Parses text nodes containing lecture data.
   * @param nodes An array of text nodes representing lecture data.
   * @returns Parsed lecture data.
   */
  private parseTextNodes(nodes: string[]) {
    const time = nodes[4].split("-");
    return {
      subject: nodes[0],
      roomNo: nodes[1],
      teacher: nodes[2],
      startTime: {
        hours: parseInt(time[0].split(":")[0]),
        minutes: parseInt(time[0].split(":")[1]),
      },
      endTime: {
        hours: parseInt(time[1].split(":")[0]),
        minutes: parseInt(time[1].split(":")[1]),
      },
    };
  }
}

export default TimetableParser;
