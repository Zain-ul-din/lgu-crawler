// ***********************************************************************************
// BACKGROUND:
// The application utilizes a cluster of worker processes to improve performance when gathering timetable data from
// an official website. Without clusters, fetching and processing data sequentially could lead to slower performance
// due to limited CPU utilization. By distributing the workload across multiple cores using clusters,
// the application can efficiently retrieve and process data in parallel, resulting in faster execution times.
// ***********************************************************************************

import os from "os";
import {chunkifyArray, clamp, promisify} from "./util";
import TimetableRequestPayload from "../types/TimetableRequestPayload";
import cluster from "cluster";
import {MetaDataCrawler, TimetableCrawler} from "../crawlers";
import TimetableParser from "../parsers/TimetableParser";
import TimetableType from "../types/TimetableType";
import OptionsParser from "../parsers/OptionsParser";
import {EventEmitter} from "stream";
import {MetaDataCrawlerReturnType} from "../crawlers/MetaDataCrawler";
import TimetableDocType from "../types/TimetableDocType";

/**
 * Worker class manages the process of crawling and processing timetable data using
 * a cluster of worker processes to improve performance.
 */
class Worker {
  /** The number of available CPU cores */
  private availableCores: number;

  /** Event emitter for handling metadata crawl events */
  private onCrawlMetaDataEvent: EventEmitter;

  /** Event emitter for handling timetable crawl events */
  private onCrawlTimetableEvent: EventEmitter;

  /** Event emitter for handling crawl completion events */
  private onCrawlFinishEvent: EventEmitter;

  /** Events */
  private static EVENT_NAMES = {
    /** Event emitted when metadata is crawled */
    ON_CRAWL_METADATA: "meta_data",

    /** Event emitted when timetable data is crawled */
    ON_CRAWL_TIMETABLE: "timetable",

    /** Event emitted when the crawl process is finished */
    ON_CRAWL_FINISH: "finish",
  };

  /**
   * Registers a callback function to be invoked when metadata is crawled.
   * @param cb Callback function to handle crawled metadata.
   */
  public onCrawlMetaData(cb: (data: MetaDataCrawlerReturnType) => void) {
    this.onCrawlMetaDataEvent.on(Worker.EVENT_NAMES.ON_CRAWL_METADATA, cb);
    return this;
  }

  /**
   * Registers a callback function to be invoked when timetable data is crawled.
   * @param cb Callback function to handle crawled timetable data.
   */
  public onCrawlTimetable(cb: (data: TimetableDocType) => void) {
    this.onCrawlTimetableEvent.on(Worker.EVENT_NAMES.ON_CRAWL_TIMETABLE, cb);
    return this;
  }

  /**
   * Registers a callback function to be invoked when crawling finishes.
   * @param cb Callback function to handle the completion of crawling.
   */
  public onFinish(cb: (data: TimetableDocType[]) => void) {
    this.onCrawlFinishEvent.on(Worker.EVENT_NAMES.ON_CRAWL_FINISH, cb);
    return this;
  }

  /**
   * Constructs a new Worker instance.
   */
  public constructor() {
    this.availableCores = clamp(os.cpus().length, 2, 2);
    this.onCrawlMetaDataEvent = new EventEmitter();
    this.onCrawlTimetableEvent = new EventEmitter();
    this.onCrawlFinishEvent = new EventEmitter();
  }

  /**
   * Starts the crawling process.
   */
  public start() {
    this.scrapMetaData();
    this.registerWorkers();
    return this;
  }

  /**
   * Initiates the crawling of metadata.
   */
  private scrapMetaData() {
    if (!cluster.isPrimary) return;

    const metaDataCrawler = new MetaDataCrawler({parser: new OptionsParser()});

    metaDataCrawler.on("crawl", (data) => {
      this.onCrawlMetaDataEvent.emit(Worker.EVENT_NAMES.ON_CRAWL_METADATA, data);
      this.spawnWorkers(data.timeTableRequestPayloads);
    });

    metaDataCrawler.crawl();
  }

  /**
   * Spawns worker processes to crawl timetable data.
   * @param payloads Array of timetable request payloads to be processed.
   */
  private spawnWorkers(payloads: TimetableRequestPayload[]) {
    chunkifyArray(payloads, this.availableCores).forEach((chunk) => {
      const worker = cluster.fork();
      worker.send(chunk);
    });

    let timetables: TimetableType[] = [];

    for (let id in cluster.workers) {
      cluster.workers[id]?.on("message", (timetable: TimetableType) => {
        this.onCrawlTimetableEvent.emit(Worker.EVENT_NAMES.ON_CRAWL_TIMETABLE, timetable);
        timetables.push(timetable);
        if (timetables.length === payloads.length)
          this.onCrawlFinishEvent.emit(Worker.EVENT_NAMES.ON_CRAWL_FINISH, timetables);
      });
    }
  }

  /**
   * Registers worker processes to crawl timetable data.
   */
  private registerWorkers() {
    if (!cluster.isWorker) return;

    process.on("message", async (payloads: TimetableRequestPayload[]) => {
      await promisify(
        payloads.map(async (payload) => {
          const timetableCrawler = new TimetableCrawler({timetableParser: new TimetableParser()});
          const timetable = await timetableCrawler.crawl(payload);
          process.send && process.send(timetable);
        })
      );
      process.disconnect();
    });
  }
}

export default Worker;
