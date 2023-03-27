import { scrapeMetaData } from "./meta_data";

console.log ("scrapping data...");
console.log ("ID: " + process.env.SESSION_ID);

(async()=>{
    console.log ("MetaData: "+await scrapeMetaData());
})();


