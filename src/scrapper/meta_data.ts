///
/// META_DATA_SCRAPPER
///

import { getHomePage } from '../lib/home_page';
import { Browser, Page } from 'puppeteer';

import { spinner } from '@clack/prompts';

export async function scrapeMetaData() 
{
    const metaData: any = {};

    const s = spinner();

    s.start("Crawling Page");
    
    const [browser, page]: [Browser, Page] = await getHomePage ();
    await page.waitForSelector('#semester');
    const dropDown = await page.$('#semester');
    await dropDown?.select();

    s.stop("Page has been reached");
    
    s.start("Scraping Semesters Data");

    const semesters = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll('#semester option')).map((element) =>
            element.innerHTML.trim()
        );
    });

    s.stop(`Succeed with data: [${semesters.toString()}]`);
    
    // fetch semester
    for (let i = 1; i < semesters.length; i += 1) {
        s.start(`Scraping Programs Data | Payload = { semester: ${semesters[i]} }`);
        
        await page.select('#semester', semesters[i]);
        await page.waitForNetworkIdle();


        const programs = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll('#program option')).map((element) =>
                element.innerHTML.trim()
            );
        });

        const programsVal = await page.evaluate(async () => {
            return Array.from(document.querySelectorAll('#program option')).map(
                (ele) => (ele as HTMLSelectElement).value
            );
        });

        s.stop(`Succeed with data:  { semester: ${semesters[i]}, programs: [${programs.toString()}] }`);
        
        // fetch programs
        for (let j = 1; j < programs.length; j += 1) {
           s.start(`Scraping Programs Data | Payload = { semester: ${semesters[i]}, program: ${programs[i]} }`);
           
           await page.select('#program', programsVal[j]);
           await page.waitForNetworkIdle();
           
           const sections = await page.evaluate(async () => {
              return Array.from(document.querySelectorAll('#section option')).map((element) =>
              element.innerHTML.trim()
              );
            });
            
            sections.splice(0, 1);
            
            s.stop(`Succeed with data: { semester: ${semesters[i]}, program: ${programs[j]}, section:${sections.toString()} }`);
            
            metaData[semesters[i]] = {
                ...metaData[semesters[i]],
                [programs[j]]: sections
            };
        }
    }
    
    browser.close();

    return metaData;
}

