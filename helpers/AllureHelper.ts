import { test as baseTest } from '@playwright/test';

/**
 * Enhanced Allure Helper for AirCloset Playwright Tests
 * Provides utility functions for enriching Allure reports
 */
export class AllureHelper {
    /**
     * Adds a screenshot to the Allure report with a custom name
     * 
     * @param testInfo - Playwright test info object
     * @param name - Name for the attachment
     * @param content - Buffer or string content
     */
    static addScreenshot(testInfo: any, name: string, content: Buffer | string): void {
        testInfo.attachments.push({
            name,
            contentType: 'image/png',
            body: content
        });
    }

    /**
     * Adds an HTML snippet to the Allure report
     * 
     * @param testInfo - Playwright test info object
     * @param name - Name for the attachment
     * @param content - HTML content as string
     */
    static addHtml(testInfo: any, name: string, content: string): void {
        testInfo.attachments.push({
            name,
            contentType: 'text/html',
            body: Buffer.from(content)
        });
    }

    /**
     * Adds a JSON object to the Allure report
     * 
     * @param testInfo - Playwright test info object
     * @param name - Name for the attachment
     * @param content - Object to be stringified
     */
    static addJson(testInfo: any, name: string, content: any): void {
        testInfo.attachments.push({
            name,
            contentType: 'application/json',
            body: Buffer.from(typeof content === 'string' ? content : JSON.stringify(content, null, 2))
        });
    }

    /**
     * Adds a text file to the Allure report
     * 
     * @param testInfo - Playwright test info object
     * @param name - Name for the attachment
     * @param content - Text content
     */
    static addText(testInfo: any, name: string, content: string): void {
        testInfo.attachments.push({
            name,
            contentType: 'text/plain',
            body: Buffer.from(content)
        });
    }

    /**
     * Creates a new test step and executes the provided function within it
     * 
     * @param testInfo - Playwright test info object
     * @param name - Step name
     * @param callback - Function to execute within the step
     * @returns The result of the callback function
     */
    static async step<T>(testInfo: any, name: string, callback: () => Promise<T>): Promise<T> {
        // Execute the step and add an annotation about it
        try {
            console.log(`STEP: ${name}`);
            testInfo.annotations.push({ type: 'step', description: name });
            const result = await callback();
            testInfo.annotations.push({ type: 'step_result', description: `${name} - Completed` });
            return result;
        } catch (error) {
            testInfo.annotations.push({ type: 'step_result', description: `${name} - Failed: ${error}` });
            throw error;
        }
    }

    /**
     * Sets the severity level of the test
     * 
     * @param testInfo - Playwright test info object
     * @param level - Severity level (blocker, critical, normal, minor, trivial)
     */
    static setSeverity(testInfo: any, level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): void {
        testInfo.annotations.push({ type: 'severity', description: level });
    }

    /**
     * Sets the epic for the test
     * 
     * @param testInfo - Playwright test info object
     * @param epic - Epic name
     */
    static setEpic(testInfo: any, epic: string): void {
        testInfo.annotations.push({ type: 'epic', description: epic });
    }

    /**
     * Sets the feature for the test
     * 
     * @param testInfo - Playwright test info object
     * @param feature - Feature name
     */
    static setFeature(testInfo: any, feature: string): void {
        testInfo.annotations.push({ type: 'feature', description: feature });
    }

    /**
     * Sets the story for the test
     * 
     * @param testInfo - Playwright test info object
     * @param story - Story name
     */
    static setStory(testInfo: any, story: string): void {
        testInfo.annotations.push({ type: 'story', description: story });
    }
}

export { expect } from '@playwright/test';
export { test } from '@playwright/test';
