/*
    NOTE!
        THIS SCRIPT IS RUN BY GITHUB ACTION TO SCRAP DATA ON THE CLOUD
*/

import dotenv from 'dotenv';
dotenv.config();

import { scrapeMetaData } from './meta_data';
import { write_metadata, writeTimetableData } from '../lib/firebase';
import { getHomePage } from '../lib/home_page';
import { scrapTimetable } from './timetable';

console.log('scrapping data...');

console.log('key: ' + process.env.SESSION_ID);

(async () => {
    const metaData = await scrapeMetaData();
    // await write_metadata(metaData);
    console.log('MetaData has been updated on firebase!!');

    // scrap

    for await (let [semester, data] of Object.entries(metaData)) {
        for await (let [program, sections] of Object.entries(data as any)) {
            for await (let section of sections as Array<string>) {
                const payload = {
                    semester: semester.trim(),
                    program: program.trim(),
                    section: section.trim()
                };

                console.log('meta_data => ', payload);

                try {
                    const [browser, page] = await getHomePage();
                    const userAgent =
                        'Mozilla/5.0 (X11; Linux x86_64)' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
                    await page.setUserAgent(userAgent);

                    await page.waitForNetworkIdle();

                    sleep(1000);

                    const res = await scrapTimetable(payload, page);
                    

                    
                    // write data to firebase
                    writeTimetableData(res, 
                        replaceAll (
                            `${payload.semester} ${payload.program} ${payload.section}`,
                            `/`,
                            '-'
                        )
                    );
                    browser.close();
                } catch (err) {
                    console.log('fail: ' + payload);
                }
            }
        }
    }

    console.log('Semester Data has been fetched');

    process.exit();
})();

function sleep(milliseconds: number) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}

function escapeRegExp(str:string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
