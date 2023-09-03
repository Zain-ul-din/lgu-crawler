///
/// META_DATA_SCRAPPER
///

import { getHomePage } from '../lib/home_page';
import { Browser, Page } from 'puppeteer';
import { shouldExcludeStr } from "../lib/util"; 
import { toPrettierStr } from '../lib/prettier';

export async function scrapeMetaData() {
    const metaData: any = {};

    const [browser, page]: [Browser, Page] = await getHomePage();

    ///
    /// Fetch Semesters
    ///

    await page.waitForSelector('#semester');
    await page.waitForSelector("#semester option");

    const dropDown = await page.$('#semester');
    await dropDown?.select();

    const semesters = (await page.evaluate(async () => {
        return Array.from(document.querySelectorAll('#semester option')).map((element) =>
            element.innerHTML.trim()
        );
    }))
    .filter(str=> !shouldExcludeStr(str));

    console.log(toPrettierStr("Semesters Fetch Result", JSON.stringify(semesters)));
    
    ///
    /// Fetch Programs
    ///

    interface ProgramMetaData 
    {
        value: string,
        innerHtml: string
    }

    for(let i = 0 ; i < semesters.length; i+= 1) 
    {
        await page.select("#semester", semesters[i]);
        await page.waitForNetworkIdle();
        await page.waitForSelector("#semester option");

        const programs = (await page.evaluate(async ()=> {
              return Array.from(document.querySelectorAll('#program option')).map((ele) =>
                ({ innerHtml: ele.innerHTML.trim(), value: (ele as HTMLSelectElement).value } as ProgramMetaData)
              );
        }))
        .filter(str=> !shouldExcludeStr(str.innerHtml));
        
        console.log(toPrettierStr(
            `${semesters[i]} => Programs Fetch Results:`, 
            JSON.stringify(programs)
        ));  

        if(programs.length == 0) continue;

        ///
        /// Fetch Sections
        ///

        for(let j = 0 ; j < programs.length; j+= 1)
        {
            await page.waitForSelector("#semester option");
            await page.select('#program', programs[j].value);
            await page.waitForNetworkIdle();
            await page.waitForSelector("#section option");

            const sections = (await page.evaluate(async () => {
                return Array.from(document.querySelectorAll('#section option')).map(
                    (element) =>element.innerHTML.trim()
                );
            })).filter(str=> !shouldExcludeStr(str));

            console.log(toPrettierStr(
                `${semesters[i]} => ${programs[j].innerHtml} => Sections Fetch Results:`, 
                JSON.stringify(sections)
            ));  

            if(sections.length == 0) continue;

            ///
            /// Sets meta data
            ///

            metaData[semesters[i]] = {
                ...metaData[semesters[i]],
                [programs[j].innerHtml]: sections
            };
        }
    }

    browser.close();
    console.log(`${metaData}\n`);
    return metaData;
}



