import { intro, outro, spinner, select } from '@clack/prompts';
import { delay, replaceAll, sleep } from './lib/util';
import { scrapeMetaData } from './scrapper/meta_data';
import dotenv from 'dotenv';
dotenv.config();

import { write_metadata, writeTimetableData, calculateTeachersTimetable, calculatePastTimetableInputOptions } from './lib/firebase';
import { scrapTimetable } from './scrapper/timetable';
import { getHomePage } from './lib/home_page';

import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';

const CACHE_FILE_NAME = 'cache.json';
const s = spinner();

enum CLI_OPTIONS {
    past_papers = 'past_papers',
    teachers_timetable = 'teachers_timetable',
    crawler = 'crawler'
}

const option = await select({
    message: 'Pick a project type.',
    options: [
        { value: CLI_OPTIONS.past_papers, label: 'update past papers metadata' },
        { value: CLI_OPTIONS.teachers_timetable, label: 'update teachers timetable metadata' },
        { value: CLI_OPTIONS.crawler, label: 'run full crawler', hint: 'oh no! Make sure you have super computer' }
    ]
});

const update_teachers_timetable = async ()=> {
    s.start('Calculating teachers timetable');
    await calculateTeachersTimetable();
    s.stop('teachers timetable has been written to firestore');
};

const update_past_paper_input = async ()=> {
    s.start("Fetching Data from firebase and calculating");
    await calculatePastTimetableInputOptions()
    s.stop("Data has been written to past_paper_input collection");
}

if ((option as CLI_OPTIONS) == CLI_OPTIONS.past_papers)
{
    await update_past_paper_input();
}
else if ((option as CLI_OPTIONS) == CLI_OPTIONS.teachers_timetable)
{
    await update_teachers_timetable();
}

if ((option as CLI_OPTIONS) != CLI_OPTIONS.crawler)
    process.exit(0)


/// INTRO

intro('Welcome to LGU Timetable Crawler 🤖');

const intro_cli = async () => {
    s.start('preparing for MetaData fetching | key = ' + process.env.SESSION_ID);
    await delay(2);
    s.stop('All set! Going to fetch MetaData');
};

await intro_cli();

var metaData = undefined;

var hasCache = existsSync(CACHE_FILE_NAME);

if (hasCache) {
    const file_buffer = readFileSync(CACHE_FILE_NAME, 'utf-8');
    metaData = JSON.parse(file_buffer);
} else {
    metaData = await scrapeMetaData();
    s.start('Writing MetaData to firebase');
    await write_metadata(metaData);
    s.stop('MetaData has been added to firebase store');
    writeFileSync(CACHE_FILE_NAME, JSON.stringify(metaData));
}

for await (let [semester, data] of Object.entries(metaData)) {
    for await (let [program, sections] of Object.entries(data as any)) {
        for await (let section of sections as Array<string>) {
            const payload = {
                semester: semester.trim(),
                program: program.trim(),
                section: section.trim()
            };

            s.start(`Scraping Timetable with Payload = ${JSON.stringify(payload)}`);

            try {
                const [browser, page] = await getHomePage();
                const userAgent =
                    'Mozilla/5.0 (X11; Linux x86_64)' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
                await page.setUserAgent(userAgent);

                await page.waitForNetworkIdle();

                sleep(1000);

                const res = await scrapTimetable(payload, page);

                s.stop('Scraped Successfully | payload = ' + JSON.stringify(payload));

                // write data to firebase
                s.start(
                    `Writing Timetable Data to FireStore | Payload = ${JSON.stringify(payload)}`
                );
                writeTimetableData(
                    res,
                    replaceAll(
                        `${payload.semester} ${payload.program} ${payload.section}`,
                        `/`,
                        '-'
                    )
                );
                s.stop(
                    `Write Operation to FireStore Succeed | DocId = '${payload.semester} ${payload.program} ${payload.section}'`
                );
                browser.close();
            } catch (err) {
                s.stop(`fail with an error: ${err}`);
            }
        }

        delete metaData[semester][program];
        writeFileSync(CACHE_FILE_NAME, JSON.stringify(metaData));
    }

    delete metaData[semester];
    writeFileSync(CACHE_FILE_NAME, JSON.stringify(metaData));
}

unlinkSync(CACHE_FILE_NAME);

await update_teachers_timetable()
await update_past_paper_input();

outro('Happy Coding ♥');

