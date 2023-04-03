import { Router, Request, Response } from 'express';
import { getHomePage } from '../lib/home_page';
import { Browser, Page } from 'puppeteer';

const metaDataRoute = Router();

export async function scrapeMetaData() {
    const metaData: any = {};

    const [browser, page]: [Browser, Page] = await getHomePage();

    await page.waitForSelector('#semester');
    const dropDown = await page.$('#semester');
    await dropDown?.select();

    const semesters = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll('#semester option')).map((element) =>
            element.innerHTML.trim()
        );
    });

    // fetch semester
    for (let i = 1; i < semesters.length; i += 1) {
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

        // fetch programs
        for (let j = 1; j < programs.length; j += 1) {
            await page.select('#program', programsVal[j]);
            await page.waitForNetworkIdle();

            const sections = await page.evaluate(async () => {
                return Array.from(document.querySelectorAll('#section option')).map((element) =>
                    element.innerHTML.trim()
                );
            });

            sections.splice(0, 1);

            metaData[semesters[i]] = {
                ...metaData[semesters[i]],
                [programs[j]]: sections
            };
        }
    }

    browser.close();

    return metaData;
}

metaDataRoute.get('/', async (req: Request, res: Response) => {
    const metaData = await scrapeMetaData();
    res.send(metaData);
});

export default metaDataRoute;
