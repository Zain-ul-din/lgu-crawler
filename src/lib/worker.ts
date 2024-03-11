import os from "os";
import {chunkifyArray, clamp} from "./util";
import TimetableRequestPayload from "../types/TimetableRequestPayload";
import cluster from "cluster";
import {TimetableCrawler} from "../crawlers";
import TimetableParser from "../parsers/TimetableParser";

export function spawnTimetablesFetchWorkers(payloads: TimetableRequestPayload[]) {
  const availableCores = clamp(os.cpus().length, 2, 120);
  chunkifyArray(payloads, availableCores).forEach((chunk) => {
    const worker = cluster.fork();
    worker.send(chunk);
  });
}

export function joinTimetableWorker(cb: (instance: TimetableCrawler) => void) {
  if (!cluster.isWorker) return;

  process.on("message", async (payloads: TimetableRequestPayload[]) => {
    await Promise.all(
      payloads.map(async (payload) => {
        const timetableCrawler = new TimetableCrawler({timetableParser: new TimetableParser()});
        cb(timetableCrawler);
        return await timetableCrawler.crawl(payload);
      })
    );
    process.disconnect();
  });
}
