import usePuppeteer from './puppeteer';

export async function getLoginPage() {
    const URL = 'https://timetable.lgu.edu.pk/index.php';
    return await usePuppeteer(URL, {
        async initPage(_) {},
        launchOptions: { headless: process.env.HEAD_LESS === 'true' }
    });
}

