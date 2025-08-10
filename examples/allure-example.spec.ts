import { test, expect } from '../helpers/AllureHelper';
import { AllureHelper } from '../helpers/AllureHelper';

test.describe('Allure Report Example Tests', () => {

    test('Basic test with Allure annotations', async ({ page }, testInfo) => {
        // Set Allure metadata
        AllureHelper.setFeature(testInfo, 'Allure Integration');
        AllureHelper.setStory(testInfo, 'Example of basic Allure annotations');
        AllureHelper.setSeverity(testInfo, 'normal');

        await AllureHelper.step(testInfo, 'Navigate to AirCloset', async () => {
            await page.goto('https://aircloset.jp/');
        });

        await AllureHelper.step(testInfo, 'Verify page title', async () => {
            const title = await page.title();
            expect(title).toContain('AirCloset');

            // Add page screenshot to report
            const screenshot = await page.screenshot();
            AllureHelper.addScreenshot(testInfo, 'Homepage Screenshot', screenshot);
        });

        // Add JSON example data to report
        const exampleData = {
            testName: 'Basic test with Allure annotations',
            status: 'passed',
            timestamp: new Date().toISOString()
        };
        AllureHelper.addJson(testInfo, 'Test Metadata', exampleData);
    });

    test('Test with HTML content capture', async ({ page }, testInfo) => {
        AllureHelper.setFeature(testInfo, 'Allure Integration');
        AllureHelper.setStory(testInfo, 'HTML content capture');
        AllureHelper.setSeverity(testInfo, 'minor');

        await page.goto('https://aircloset.jp/');

        // Capture HTML content of a specific section
        await AllureHelper.step(testInfo, 'Capture main navigation HTML', async () => {
            const headerHtml = await page.evaluate(() => {
                const header = document.querySelector('header');
                return header ? header.outerHTML : '<p>Header not found</p>';
            });

            AllureHelper.addHtml(testInfo, 'Header HTML Structure', headerHtml);
        });

        // Add page source as text
        const pageContent = await page.content();
        AllureHelper.addText(testInfo, 'Full Page Source', pageContent);
    });

    test('Test with multiple steps and environment info', async ({ page }, testInfo) => {
        AllureHelper.setFeature(testInfo, 'Allure Integration');
        AllureHelper.setStory(testInfo, 'Detailed test steps with environment info');
        AllureHelper.setSeverity(testInfo, 'critical');

        // Capture environment info
        const environmentInfo = {
            browser: process.env.BROWSER || 'chromium',
            platform: process.platform,
            timestamp: new Date().toISOString(),
            viewport: page.viewportSize()
        };

        AllureHelper.addJson(testInfo, 'Environment Information', environmentInfo);

        await AllureHelper.step(testInfo, 'Navigate to AirCloset', async () => {
            await page.goto('https://aircloset.jp/');
        });

        await AllureHelper.step(testInfo, 'Check main heading', async () => {
            await expect(page).toHaveTitle(/AirCloset/);
        });

        // Capture screenshot at this stage
        await AllureHelper.step(testInfo, 'Capture homepage state', async () => {
            const screenshot = await page.screenshot();
            AllureHelper.addScreenshot(testInfo, 'Homepage Visual State', screenshot);
        });
    });
});
