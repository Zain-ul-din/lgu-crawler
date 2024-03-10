import {FetchOptions, ofetch} from "ofetch";
import request_headers from "../static/request_headers.json";

/**
 * base class for all crawlers
 */
abstract class Crawler {
  /**
   * Request headers to be sent with each request
   */
  protected static readonly REQUEST_HEADERS = {
    ...request_headers,
    Cookie: "PHPSESSID=mng9udsif6hnrb4domhil0hks1",
  };

  /**
   * Fetchs content by making http request
   * @param url target URL
   * @param [opts] request options
   * @returns A Promise resolving to the response content.
   */
  protected fetchContent(url: string, opts?: FetchOptions<"json"> | undefined) {
    return ofetch(url, {
      headers: Crawler.REQUEST_HEADERS,
      method: "GET",
      ...(opts || {}),
    });
  }
}

export default Crawler;
