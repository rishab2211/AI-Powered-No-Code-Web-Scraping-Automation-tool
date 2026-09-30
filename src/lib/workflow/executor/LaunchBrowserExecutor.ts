import { ExecutionEnvironment } from "@/app/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website URL");

        const browser = await puppeteer.launch({
            headless: process.env.PUPPETEER_HEADLESS !== "false",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--single-process",
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        });
        environment.setBrowser(browser);

        environment.log.info("Browser started successfully!");
        const page = await browser.newPage();

        await page.goto(websiteUrl);

        environment.setPage(page);
        environment.log.info(`Opened page at ${websiteUrl}`);

        await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});

        return true;
    } catch (err: any) {
        environment.log.error(err.message);
        return false;
    }
}