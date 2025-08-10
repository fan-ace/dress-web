import { test, expect } from '../fixtures/login-popup.fixture';
import { TestGroups } from '../config-management/TestGroup';

/**
 * Example of using the updated login-popup-assertions fixture
 * Shows how to get LoginAssertions for specific sources
 */

const TAGS = [
    TestGroups.PRIORITY.P1,
    TestGroups.TYPE.INTEGRATION,
    TestGroups.FEATURE.LOGIN,
];

test.describe('Login Popup Fixture Examples', {
    tag: TAGS
}, () => {
    /**
     * Example showing the default behavior (TopPage)
     */
    test('should use default loginAssertions for TopPage', async ({
        loginAssertions,
        openLoginPopupFromSource,
    }) => {
        // Uses the default loginAssertions (TopPage)
        await openLoginPopupFromSource('top-page');
        await loginAssertions.verifyPopupIsDisplayed();
    });

    /**
     * Example showing how to use getLoginAssertions for a specific source
     */
    test('should use custom loginAssertions for FashionDiagnosis page', async ({
        getLoginAssertions,
        openLoginPopupFromSource,
    }) => {
        // First navigate to and open the login popup
        await openLoginPopupFromSource('fashion-diagnosis');

        // Get the appropriate LoginAssertions for the current context
        const fashionPageLoginAssertions = getLoginAssertions('fashion-diagnosis');

        // Use the custom LoginAssertions
        await fashionPageLoginAssertions.runBasicAssertions();
    });

    /**
     * Example showing how to test multiple sources in the same test
     */
    test('should verify login popups across different pages', async ({
        getLoginAssertions,
        openLoginPopupFromSource,
    }) => {
        // Test on TopPage
        await openLoginPopupFromSource('top-page');
        const topPageAssertions = getLoginAssertions('top-page');
        await topPageAssertions.verifyPopupIsDisplayed();

        // Test on Fashion Diagnosis Guide Page
        await openLoginPopupFromSource('fashion-diagnosis-guide');
        const guidePageAssertions = getLoginAssertions('fashion-diagnosis-guide');
        await guidePageAssertions.verifyPopupIsDisplayed();
    });
});
