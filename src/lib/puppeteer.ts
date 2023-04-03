import puppeteer, { PuppeteerLaunchOptions, Page, Browser } from 'puppeteer';

type Params = {
    launchOptions?: PuppeteerLaunchOptions | undefined;
    initPage: (page: Page) => Promise<void>;
};

export default async function usePuppeteer(url: string, params: Params): Promise<[Browser, Page]> {
    const browser = await puppeteer.launch(params.launchOptions);
    const page = await browser.newPage();

    await params.initPage(page);
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    await page.setUserAgent(
        '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
    );

    return [browser, page];
}
