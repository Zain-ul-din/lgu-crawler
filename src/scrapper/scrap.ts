/*
    NOTE!
        THIS SCRIPT IS RUN BY GITHUB ACTION TO SCRAP DATA ON THE CLOUD
*/

import dotenv from "dotenv";
dotenv.config();

import { scrapeMetaData } from "./meta_data";

console.log ("scrapping data...");

(async()=>{
    console.log ("MetaData: "+await scrapeMetaData());
})();


