import usePuppeteer from './puppeteer';

export async function getHomePage() {
    const URL = 'https://timetable.lgu.edu.pk/Semesters/Semester_pannel.php';
    return await usePuppeteer(URL, {
        async initPage(page) {
            await page.setCookie({
                name: 'PHPSESSID',
                value: process.env.SESSION_ID as string,
                domain: 'timetable.lgu.edu.pk',
                path: '/',
                httpOnly: true
            });
        },
        launchOptions: { headless: true }
    });
}

