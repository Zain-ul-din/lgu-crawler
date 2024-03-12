import {load} from "cheerio";
import HTMLOptionsType from "../types/HTMLOptionsType";
import Parser from "./Parser";

class OptionsParser extends Parser<HTMLOptionsType> {
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

export default OptionsParser;
