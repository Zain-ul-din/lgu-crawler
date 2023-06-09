///
/// TIMETABLE SCRAPPER
///

import { Page } from 'puppeteer';

interface Payload 
{
    semester: string;
    program: string;
    section: string;
}

export async function scrapTimetable(payload: Payload, page: Page): Promise<any> 
{
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
                (ele as HTMLOptionElement).text.trim() == program.trim() ? (ele as HTMLOptionElement).value : null
            )
            .filter((ele) => ele != null);
    }, payload.program);

    console.log (programsVal);
    if (programsVal.length == 0) 
    {
        page.reload();
        return await scrapTimetable (payload, page);
    }

    page.select('#program', programsVal[0] as string);
    await page.waitForNetworkIdle();
    
    // select section
    const sectionVal = await page.evaluate(async (section) => {
        return Array.from(document.querySelectorAll('#section option'))
            .map((ele) =>
            (ele as HTMLOptionElement).text.trim() == section.trim() ? (ele as HTMLSelectElement).value : null
            )
            .filter((ele) => ele != null);
    }, payload.section);

    if (sectionVal.length == 0) 
    {
        page.reload();
        return await scrapTimetable (payload, page);
    }

    console.log (sectionVal);
    page.select('#section', sectionVal[0] as string);
    await page.waitForNetworkIdle();
    page.click('button[type=submit]');

    // scrap timetable

    await page.waitForNetworkIdle();
    const timetableData = await page.evaluate(() => {
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

                        console.log(tdData);
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

    return timetableData;
}
