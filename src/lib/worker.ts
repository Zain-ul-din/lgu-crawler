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

class Worker {
  private availableCores: number;

  private static EVENT_NAMES = {
    ON_CRAWL_METADATA: "meta_data",
    ON_CRAWL_TIMETABLE: "timetable",
    ON_CRAWL_FINISH: "finish",
  };

  private onCrawlMetaDataEvent: EventEmitter;
  private onCrawlTimetableEvent: EventEmitter;
  private onCrawlFinishEvent: EventEmitter;

  public onCrawlMetaData(cb: (data: MetaDataCrawlerReturnType) => void) {
    this.onCrawlMetaDataEvent.on(Worker.EVENT_NAMES.ON_CRAWL_METADATA, cb);
  }

  public onCrawlTimetable(cb: (data: TimetableDocType) => void) {
    this.onCrawlTimetableEvent.on(Worker.EVENT_NAMES.ON_CRAWL_TIMETABLE, cb);
  }

  public onFinish(cb: (data: TimetableDocType[]) => void) {
    this.onCrawlFinishEvent.on(Worker.EVENT_NAMES.ON_CRAWL_FINISH, cb);
  }

  public constructor() {
    this.availableCores = clamp(os.cpus().length, 2, 120);
    this.onCrawlMetaDataEvent = new EventEmitter();
    this.onCrawlTimetableEvent = new EventEmitter();
    this.onCrawlFinishEvent = new EventEmitter();
  }

  public start() {
    this.scrapMetaData();
    this.registerWorkers();
  }

  private scrapMetaData() {
    if (!cluster.isPrimary) return;

    const metaDataCrawler = new MetaDataCrawler({parser: new OptionsParser()});

    metaDataCrawler.on("crawl", (data) => {
      this.onCrawlMetaDataEvent.emit(Worker.EVENT_NAMES.ON_CRAWL_METADATA, data);
      this.spawnWorkers(data.timeTableRequestPayloads);
    });

    metaDataCrawler.crawl();
  }

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
