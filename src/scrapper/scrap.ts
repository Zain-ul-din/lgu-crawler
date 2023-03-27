/*
    NOTE!
        THIS SCRIPT IS RUN BY GITHUB ACTION TO SCRAP DATA ON THE CLOUD
*/

import { scrapeMetaData } from "./meta_data";
import dotenv from "dotenv";
dotenv.config();

console.log ("scrapping data...");

(async()=>{
    console.log ("MetaData: "+await scrapeMetaData());
})();


