import {FetchOptions, ofetch} from "ofetch";
import request_headers from "#/static/request_headers.json";
import {EventEmitter} from "stream";
import {ENV} from "#/constants";

type CrawlerEvents = "crawl";

/**
 * Base class for all crawlers.
 * @template T - Type parameter representing the expected result type of the crawler.
 */
abstract class Crawler<T = any> {
  /**
   * An event to inform subscribers about new changes
   */
  protected readonly event: EventEmitter;

  /**
   * Event used to inform subscribers on crawl is finished and emits event with scrapped data
   */
  protected static readonly ON_CRAWL: CrawlerEvents = "crawl";

  /**
   * Constructor for the Crawler base class
   * @todo
   * call `super` in consumer class
   */
  public constructor() {
    this.event = new EventEmitter();
  }

  /**
   * Attaches a listener to the crawler for a specific event.
   * @param event - Event name.
   * @param listener - Callback function executed on event emission.
   */
  public on(event: CrawlerEvents, listener: (arg: T) => void) {
    this.event.on(event, listener);
  }

  /**
   * Request headers to be sent with each request
   */
  protected static readonly REQUEST_HEADERS = {
    ...request_headers,
    Cookie: `PHPSESSID=${ENV.PHPSESSID}`,
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
