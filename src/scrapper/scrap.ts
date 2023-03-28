/*
    NOTE!
        THIS SCRIPT IS RUN BY GITHUB ACTION TO SCRAP DATA ON THE CLOUD
*/

import dotenv from "dotenv";
dotenv.config();

import { scrapeMetaData } from "./meta_data";
import { write_metadata } from "../lib/firebase";

console.log ("scrapping data...");

console.log ("key: " + process.env.SESSION_ID);

(async()=>{
    const metaData = await scrapeMetaData();
    await write_metadata (metaData);
    console.log ("MetaData has been updated on firebase!!");
    
})();



