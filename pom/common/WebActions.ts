import { Locator, Page, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * WebActions class provides common utility methods for interacting with web elements.
 * This reduces code duplication and enhances maintainability across page objects.
 */
export class WebActions {
    private readonly page: Page;
    private readonly screenshotDir: string;

    constructor(page: Page) {
        this.page = page;
        this.screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');

        // Create the screenshots directory if it doesn't exist
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    /**
     * Safely clicks on an element with proper waiting and error handling
     * @param locator Element to click
     * @param options Optional click options
     */
    async safeClick(locator: Locator, options = {}): Promise<void> {
        try {
            // Check if page is closed before attempting any operations
            if (this.page.isClosed()) {
                throw new Error('Cannot perform action: Target page, context or browser has been closed');
            }
            await locator.waitFor({ state: 'visible', timeout: 60000 });
            await locator.click(options);
            await this.page.waitForTimeout(500); // Wait for any potential animations
        } catch (error) {
            console.error(`Failed to click element: ${error}`);
            if (!this.page.isClosed()) {
                await this.takeScreenshot('click-error');
            }
            throw error;
        }
    }

    /**
     * Safely fills a form field with proper waiting and error handling
     * @param locator Form field to fill
     * @param value Value to enter
     */
    async safeFill(locator: Locator, value: string): Promise<void> {
        try {
            // Check if page is closed before attempting any operations
            if (this.page.isClosed()) {
                throw new Error('Cannot perform action: Target page, context or browser has been closed');
            }
            await locator.waitFor({ state: 'visible', timeout: 60000 });
            await locator.fill(value);
        } catch (error) {
            console.error(`Failed to fill element: ${error}`);
            await this.takeScreenshot('fill-error');
            throw error;
        }
    }

    /**
     * Checks if an element is visible
     * @param locator Element to check
     * @param timeout Optional timeout in milliseconds
     * @returns Whether the element is visible
     */
    async isVisible(locator: Locator, timeout = 60000): Promise<boolean> {
        try {
            // Check if page is closed before attempting any operations
            if (this.page.isClosed()) {
                throw new Error('Cannot perform action: Target page, context or browser has been closed');
            }
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch (error) {
            if (String(error).includes('has been closed')) {
                throw error; // Re-throw if it's a browser closed error
            }
            return false;
        }
    }

    /**
     * Gets text from an element with error handling
     * @param locator Element to get text from
     * @returns The text content or empty string if not found
     */
    async getText(locator: Locator): Promise<string> {
        try {
            // Check if page is closed before attempting any operations
            if (this.page.isClosed()) {
                throw new Error('Cannot perform action: Target page, context or browser has been closed');
            }
            if (await this.isVisible(locator)) {
                return await locator.textContent() || '';
            }
            return '';
        } catch (error) {
            console.error(`Failed to get text: ${error}`);
            if (String(error).includes('has been closed')) {
                throw error; // Re-throw if it's a browser closed error
            }
            return '';
        }
    }

    /**
     * Takes a screenshot with timestamp and meaningful name
     * @param name Base name for the screenshot
     * @returns Path to the saved screenshot
     */
    async takeScreenshot(name: string): Promise<string> {
        // Don't try to take screenshots if page is already closed
        if (this.page.isClosed()) {
            console.warn('Cannot take screenshot: Page is closed');
            return '';
        }

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${name}-${timestamp}.png`;
            const filePath = path.join(this.screenshotDir, fileName);

            await this.page.screenshot({ path: filePath, fullPage: true });
            console.log(`Screenshot saved: ${filePath}`);
            return filePath;
        } catch (error) {
            console.error(`Failed to take screenshot: ${error}`);
            return '';
        }
    }

    /**
     * Waits for a specified time (use cautiously, prefer conditional waiting)
     * @param ms Time to wait in milliseconds
     */
    async wait(ms: number): Promise<void> {
        await this.page.waitForTimeout(ms);
    }

    /**
     * Waits for navigation to complete
     * @param options Navigation options
     */
    async waitForNavigation(options = {}): Promise<void> {
        await this.page.waitForLoadState('networkidle', options);
    }

    /**
     * Executes an action with retry logic
     * @param action Function to execute
     * @param maxRetries Maximum number of retries
     * @param retryDelay Delay between retries in milliseconds
     */
    async retry<T>(
        action: () => Promise<T>,
        maxRetries = 3,
        retryDelay = 1000
    ): Promise<T> {
        let lastError: Error | unknown;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                return await action();
            } catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt + 1} failed: ${error}`);

                if (attempt < maxRetries - 1) {
                    await this.wait(retryDelay);
                }
            }
        }

        throw new Error(`Action failed after ${maxRetries} attempts. Last error: ${lastError}`);
    }

    /**
     * Safely selects an option from a dropdown
     * @param dropdownLocator Locator for the dropdown element
     * @param optionValue Value to select (value attribute)
     * @param optionLocator Optional locator for the option elements if not using standard select
     */
    async selectDropdownOption(
        dropdownLocator: Locator,
        optionValue: string,
        optionLocator?: Locator
    ): Promise<void> {
        try {
            await dropdownLocator.waitFor({ state: 'visible', timeout: 10000 });

            // For standard HTML select elements
            if (!optionLocator) {
                await dropdownLocator.selectOption(optionValue);
                return;
            }

            // For custom dropdown implementations
            await this.safeClick(dropdownLocator);

            // Wait for dropdown options to be visible
            await this.page.waitForTimeout(500);

            // Find and click the specific option
            const option = this.page.locator(`${optionLocator} >> text="${optionValue}"`);
            await this.safeClick(option);

        } catch (error) {
            console.error(`Failed to select dropdown option: ${error}`);
            await this.takeScreenshot('dropdown-selection-error');
            throw error;
        }
    }

    /**
     * Safely selects an option from a dropdown by index
     * @param dropdownLocator Locator for the dropdown element
     * @param index Zero-based index of the option to select
     * @param optionLocator Optional locator for the option elements if not using standard select
     */
    async selectDropdownByIndex(
        dropdownLocator: Locator,
        index: number,
        optionLocator?: string
    ): Promise<void> {
        try {
            await dropdownLocator.waitFor({ state: 'visible', timeout: 10000 });

            // For standard HTML select elements
            if (!optionLocator) {
                await dropdownLocator.selectOption({ index });
                return;
            }

            // For custom dropdown implementations
            await this.safeClick(dropdownLocator);

            // Wait for dropdown options to be visible
            await this.page.waitForTimeout(500);

            // Find and click the option at the specified index
            const options = this.page.locator(optionLocator);
            const optionsCount = await options.count();

            if (index < 0 || index >= optionsCount) {
                throw new Error(`Index ${index} is out of bounds. Available options: ${optionsCount}`);
            }

            await this.safeClick(options.nth(index));
        } catch (error) {
            console.error(`Failed to select dropdown option by index: ${error}`);
            await this.takeScreenshot('dropdown-index-selection-error');
            throw error;
        }
    }
}
