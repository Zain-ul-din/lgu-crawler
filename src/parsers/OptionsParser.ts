import {load} from "cheerio";
import HTMLOptionsType from "#/types/HTMLOptionsType";
import Parser from "./Parser";

/**
 * Parses dropdown options from HTML content using Cheerio.
 */
export class OptionsParser extends Parser<HTMLOptionsType> {
  /**
   * Parses dropdown options from HTML content.
   * @param html The raw HTML content to parse.
   * @param selector The CSS selector to locate dropdown options.
   * @returns Parsed dropdown options containing text nodes and values.
   */
  public parse(html: string, selector: string): HTMLOptionsType {
    const $ = load(html);
    const options = $(selector)
      .toArray()
      .map((ele) => ({
        text: $(ele).text(),
        value: $(ele).attr("value") || "",
      }))
      .filter((opt) => opt.value !== "" && !opt.value.startsWith("-"));
    return {
      textNodes: options.map((opt) => opt.text.trim()),
      values: options.map((opt) => opt.value.trim()),
    };
  }
}

