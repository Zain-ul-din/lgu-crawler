import {MetaDataCrawler} from "./crawlers";
import OptionsParser from "./parsers/OptionsParser";
import cluster from "cluster";
import {joinTimetableWorker, spawnTimetablesFetchWorkers} from "./lib/worker";

if (cluster.isPrimary) {
  const metaDataCrawler = new MetaDataCrawler({parser: new OptionsParser()});

  metaDataCrawler.on("crawl", (data) => {
    spawnTimetablesFetchWorkers(data.timeTableRequestPayloads);
  });

  metaDataCrawler.crawl();
}

joinTimetableWorker((timetableCrawler) => {
  timetableCrawler.on("crawl", (res) => {
    console.log(JSON.stringify(res));
  });
});
