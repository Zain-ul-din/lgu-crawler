import { scrapeMetaData } from "./meta_data";

console.log ("scrapping data...");

(async()=>{
    console.log ("MetaData: "+await scrapeMetaData());
});


