///
/// TIMETABLE SCRAPPER
///

import { Page } from 'puppeteer';
import { replaceAll, delay, gitStageChange } from "../lib/util"

interface Payload {
    semester: string;
    program: string;
    section: string;
}

export async function scrapTimetable(payload: Payload, page: Page): Promise<any> {

    
    await page.setViewport({width: 1920, height: 1080 });

    await page.waitForSelector('#semester');
    const dropDown = await page.$('#semester');
    await dropDown?.select();

    // select semester
    page.select('#semester', payload.semester);
    await page.waitForNetworkIdle();

    // select program
    const programsVal = await page.evaluate(async (program) => {
        return Array.from(document.querySelectorAll('#program option'))
            .map((ele) =>
                (ele as HTMLOptionElement).text.trim() == program.trim()
                    ? (ele as HTMLOptionElement).value
                    : null
            )
            .filter((ele) => ele != null);
    }, payload.program);
    
    if (programsVal.length == 0) {
        page.reload();
        return await scrapTimetable(payload, page);
    }

    page.select('#program', programsVal[0] as string);
    await page.waitForNetworkIdle();

    // select section
    const sectionVal = await page.evaluate(async (section) => {
        return Array.from(document.querySelectorAll('#section option'))
            .map((ele) =>
                (ele as HTMLOptionElement).text.trim() == section.trim()
                    ? (ele as HTMLSelectElement).value
                    : null
            )
            .filter((ele) => ele != null);
    }, payload.section);

    if (sectionVal.length == 0) {
        page.reload();
        return await scrapTimetable(payload, page);
    }

    page.select('#section', sectionVal[0] as string);
    await page.waitForNetworkIdle();
    page.click('button[type=submit]');

    
    
    // scrap timetable
    await page.waitForNetworkIdle();
    await delay(1)
    
    
    const timetableData = await page.evaluate(() => {

        // add updated at label
        (()=>{
            const ele = document.createElement('h3') as HTMLDivElement
            const parent = document.querySelector(".panel > div") as HTMLDivElement

            parent.setAttribute('style', `
                padding: 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `);
            
            ele.setAttribute('style', `font-size: 24px;`);

            (parent.firstChild as HTMLDivElement).setAttribute ('style' , "color: white");
            ele.textContent = `Updated At: ${new Date().toDateString()}`
            parent.appendChild(ele)
        })()

        Array.from(document.querySelectorAll(".footer-copyright")).forEach(ele => (ele as HTMLDivElement).style.display = 'none')
        const tbody = Array.from(document.querySelectorAll('tr'));
        tbody.splice(0, 1);
        
        return tbody
            .map((ele) => {
                // th & td
                const th = ele.querySelector('th')?.innerText;
                const td = Array.from(ele.querySelectorAll('td'))
                    .map((ele) => ele.innerText)
                    .filter((ele) => ele != 'X' && ele != 'All slots are free')
                    .map((ele) => {
                        const tdData = ele.split('\n');
                        const time = tdData[4].split('-');
                        
                        return {
                            subject: tdData[0],
                            roomNo: tdData[1],
                            teacher: tdData[2],
                            startTime: {
                                hours: parseInt(time[0].split(':')[0]),
                                minutes: parseInt(time[0].split(':')[1])
                            },
                            endTime: {
                                hours: parseInt(time[1].split(':')[0]),
                                minutes: parseInt(time[1].split(':')[1])
                            }
                        };
                    });
                return { [th as string]: td };
            })
            .reduce((acc: any, curr: any) => {
                const [entry] = Object.entries(curr);
                return { ...acc, [entry[0]]: entry[1] };
            }, {});
    });

    console.log("done so far");

    await page.waitForSelector(".panel");

    const ssFileName = `${replaceAll(`${payload.semester} ${payload.program} ${payload.section}`,`/`,'-')}.png`;
    const ssFilePath = `./dist/${ssFileName}`;

    await (await page.$(".panel"))?.screenshot({
        "type": 'png',
        "path": ssFilePath
    })

    // add file to git
    gitStageChange(ssFilePath, `📷 feat:  capture ${ssFileName}`)

    return timetableData;
}
