import { Locator, Page } from "@playwright/test";
import { WebActions } from "./WebActions";
import { time } from "console";

/**
 * Base class for all page objects
 * Provides common functionality and utilities
 */
export default class BasePage {
    protected readonly page: Page;
    protected readonly actions: WebActions;
    readonly headerBanner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.actions = new WebActions(page);
        this.headerBanner = page.locator('.stgHeader');
    }

    /**
     * Waits for the header banner to appear and closes it if it's visible
     * @param timeout Optional timeout in milliseconds to wait for banner to appear (defaults to 5000ms)
     */
    public async closeHeaderBanner(timeout: number = 5000): Promise<void> {
        try {
            // Wait for the banner to be visible with the specified timeout
            await this.headerBanner.waitFor({ state: 'visible', timeout });
            await this.actions.safeClick(this.headerBanner);
        } catch (error) {
            // If timeout occurs, banner didn't appear - that's ok
            this.logInfo('Header banner not visible or already closed');
        }
    }

    /**
     * Waits for the page to be fully loaded
     */
    public async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Takes a screenshot with a meaningful name
     * @param name Screenshot name prefix
     */
    public async takeScreenshot(name: string): Promise<string> {
        return await this.actions.takeScreenshot(name);
    }

    /**
     * Gets the current page URL
     * @returns Current URL
     */
    public getPageUrl(): string {
        return this.page.url();
    }

    /**
     * Logs page information for debugging
     * @param message Message to log
     */
    protected logInfo(message: string): void {
        console.log(`[${this.constructor.name}] ${message}`);
    }
};