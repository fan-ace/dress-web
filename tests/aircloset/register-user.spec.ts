import { test, expect } from '@playwright/test';
import { FashionTypeDiagnosisPage } from '@pom/page-objects/FashionTypeDiagnosisPage';
import { FashionTypeDiagnosisQuestion01Page } from '@pom/page-objects/diagnosis/FashionTypeDiagnosisQuestion01Page';
import { FashionTypeDiagnosisQuestion02Page } from '@pom/page-objects/diagnosis/FashionTypeDiagnosisQuestion02Page';
import { FashionTypeDiagnosisQuestion03Page } from '@pom/page-objects/diagnosis/FashionTypeDiagnosisQuestion03Page';

test.describe('User Registration Flow', () => {
    test('User should be able to navigate through fashion diagnosis process', async ({ page }) => {
        // 1. Navigate to FashionTypeDiagnosisPage using URL
        const fashionDiagnosisPage = new FashionTypeDiagnosisPage(page);
        await fashionDiagnosisPage.gotoFromUrl();

        // Start the diagnosis process
        await fashionDiagnosisPage.clickStartDiagnosisButton();

        // 2. Navigate to Question 1 page and click next
        const question1Page = new FashionTypeDiagnosisQuestion01Page(page);
        expect(await question1Page.isOnPage()).toBeTruthy();
        await question1Page.clickNextButton();

        // 3. Select a vibe and click next
        // Since we didn't specify which vibe to select, let's click on the vibe option available
        await question1Page.clickVibe();
        await question1Page.clickNextButton();

        // 4. Select styleActive on Question 2 page
        const question2Page = new FashionTypeDiagnosisQuestion02Page(page);
        await question2Page.clickStyleActive();

        // 5. Click dropdown and select option with index 2 on Question 3 page
        const question3Page = new FashionTypeDiagnosisQuestion03Page(page);

        // Make sure we are on the right page
        expect(await question3Page.isOnPage()).toBeTruthy();

        // Wait a moment to ensure the page is fully loaded and stable
        await page.waitForTimeout(1000);

        // Select the occupation from dropdown (index 2)
        await question3Page.selectOccupation(2);

        // Add validation or further steps if needed
        // For example, check if the selection was successful
        // This would depend on the application behavior

        // Take a screenshot of the final state for verification
        await page.screenshot({ path: 'test-results/fashion-diagnosis-flow.png' });
    });
});
