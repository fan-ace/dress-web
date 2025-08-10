import { test } from '../../fixtures/login-popup.fixture';
import { TestGroups } from '../../config-management/TestGroup';

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

    let email: string = '';

    test.beforeAll(async ({ dbAcConnector }) => {
        // Query for MONTHLY user
        const [users] = await dbAcConnector.query('SELECT email FROM users WHERE membership_status = ? LIMIT 1', ['MONTHLY']);
        const userRows = users as { email: string }[];
        if (Array.isArray(userRows) && userRows.length > 0) {
            email = userRows[0].email;
            console.log(`Using MONTHLY user email: ${email}`);
        } else {
            console.warn('No MONTHLY users found in database. Test may fail.');
        }
    });
    /**
     * Example showing the default behavior (TopPage)
     */
    test('should use custom loginAssertions for Top page', async ({
        getLoginAssertions,
        openLoginPopupFromSource,
    }) => {
        const topPageLoginAssertions = getLoginAssertions('top-page');

        await test.step('Open Login Popup from Top Page', async () => {
            await openLoginPopupFromSource('top-page');
        });

        await test.step('Run basic assertions on Top Page login popup', async () => {
            await topPageLoginAssertions.runBasicAssertions();
        });

        await test.step('Verify login with MONTHLY user', async () => {
            await topPageLoginAssertions.verifyLoginWithValidUser('MONTHLY', email);
        });
    });

    /**
     * Example showing how to use getLoginAssertions for a specific source
     */
    test('should use custom loginAssertions for FashionDiagnosis page', async ({
        getLoginAssertions,
        openLoginPopupFromSource,
    }) => {
        const fashionPageLoginAssertions = getLoginAssertions('fashion-diagnosis');

        await test.step('Open Login Popup from Fashion Diagnosis page', async () => {
            await openLoginPopupFromSource('fashion-diagnosis');
        });

        await test.step('Run basic assertions on Fashion Diagnosis login popup', async () => {
            await fashionPageLoginAssertions.runBasicAssertions();
        });

        await test.step('Verify login with MONTHLY user', async () => {
            await fashionPageLoginAssertions.verifyLoginWithValidUser('MONTHLY', email);
        });
    });

    /**
     * Example showing how to test multiple sources in the same test
     */
    test('should use custom loginAssertions for FashionDiagnosisGuide page', async ({
        getLoginAssertions,
        openLoginPopupFromSource,
    }) => {
        const fashionPageLoginAssertions = getLoginAssertions('fashion-diagnosis-guide');

        await test.step('Go to Fashion Diagnosis Guide page and open Login popup', async () => {
            await openLoginPopupFromSource('fashion-diagnosis-guide');
        });

        await test.step('Run basic assertions on Fashion Diagnosis Guide login popup', async () => {
            await fashionPageLoginAssertions.runBasicAssertions();
        });

        await test.step('Verify login with MONTHLY user', async () => {
            await fashionPageLoginAssertions.verifyLoginWithValidUser('MONTHLY', email);
        });
    });
});
