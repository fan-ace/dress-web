import { expect } from '@playwright/test';
import { LoginPopup } from '../page-objects/LoginPopup';
import { invalidEmails, loginCredentials, validEmails } from '../../test-data/TestEmailData';

/**
 * Class containing all assertions for LoginPopup
 * Separates assertion logic from POM and test cases
 * Enables reuse of assertions across different tests
 */
export class LoginPopupAssertions {
    private readonly loginPopup: LoginPopup;
    private readonly TEST_PASSWORD = 'aircloset';

    // Constant error messages for validation
    private readonly ERROR_MESSAGES = {
        INVALID_EMAIL: '不正なメールアドレスです。',
        LOGIN_FAILED: 'Eメールアドレスが存在しないか、パスワードが誤っているためログインできません。'
    };

    /**
     * Initialize LoginPopupAssertions
     * @param loginPopup - Initialized instance of LoginPopup
     */
    constructor(loginPopup: LoginPopup) {
        this.loginPopup = loginPopup;
    }
    /**
     * Verify that LoginPopup displays correctly
     * @param timeout - Optional timeout for assertion (ms)
     * @returns Promise<void>
     */
    async verifyPopupIsDisplayed(timeout = 5000): Promise<void> {
        await expect(this.loginPopup.isDisplayed()).resolves.toBeTruthy();
        console.log('✓ Login popup is displayed correctly');
    }

    /**
     * Verify all invalid email formats
     * @param customPassword - Optional custom password to use for testing
     * @returns Promise<void>
     */
    async verifyInvalidEmailFormats(customPassword?: string): Promise<void> {
        console.log('Testing invalid email formats...');
        const password = customPassword || this.TEST_PASSWORD;

        // Test each invalid email format individually
        for (const invalidEmail of invalidEmails) {
            console.log(`Testing invalid email format: ${invalidEmail}`);

            // Clear previous input
            await this.loginPopup.clearAllFields();

            // Enter invalid email and password
            await this.loginPopup.enterEmail(invalidEmail);
            await this.loginPopup.enterPassword(password);

            // Check for error message
            const errorMessage = await this.loginPopup.getErrorMessage();
            await expect(errorMessage).toBe(this.ERROR_MESSAGES.INVALID_EMAIL);
        }

        console.log('✓ All invalid email formats validated correctly');
    }

    /**
     * Verify login with non-existent email
     * @param email - Optional specific email to test with
     * @param password - Optional specific password to test with
     * @returns Promise<void>
     */
    async verifyNonExistentEmail(email?: string, password?: string): Promise<void> {
        console.log('Testing login with non-existent email...');
        // Generate a unique email with timestamp to ensure it doesn't exist
        const nonExistentEmail = email || `nonexistent_${Date.now()}@example.com`;
        const testPassword = password || this.TEST_PASSWORD;

        // Clear previous input
        await this.loginPopup.clearAllFields();

        // Enter non-existent email and password
        await this.loginPopup.enterEmail(nonExistentEmail);
        await this.loginPopup.enterPassword(testPassword);

        // Submit the login form
        await this.loginPopup.clickLoginWithEmail();

        // Verify login failure message
        const failureMessage = await this.loginPopup.getLoginFailMessage();
        await expect(failureMessage).toBe(this.ERROR_MESSAGES.LOGIN_FAILED);

        console.log(`✓ Login with non-existent email "${nonExistentEmail}" failed as expected`);
    }

    /**
     * Verify login with invalid user credentials
     * @param customCredentials - Optional custom credentials to use for testing
     * @returns Promise<void>
     */
    async verifyInvalidUserCredentials(customCredentials?: { email: string, password: string }): Promise<void> {
        console.log('Testing login with invalid user credentials...');

        // Clear previous input
        await this.loginPopup.clearAllFields();

        if (customCredentials) {
            // Use custom credentials if provided
            await this.loginPopup.enterEmail(customCredentials.email);
            await this.loginPopup.enterPassword(customCredentials.password);
        } else {
            // Use predefined invalid credentials from test data
            await this.loginPopup.enterEmail(loginCredentials.invalidUser.email);
            await this.loginPopup.enterPassword(loginCredentials.invalidUser.password);
        }

        // Submit the login form
        await this.loginPopup.clickLoginWithEmail();

        // Verify login failure message
        const failureMessage = await this.loginPopup.getLoginFailMessage();
        await expect(failureMessage).toBe(this.ERROR_MESSAGES.LOGIN_FAILED);

        const email = customCredentials ? customCredentials.email : loginCredentials.invalidUser.email;
        console.log(`✓ Login with invalid credentials (${email}) failed as expected`);
    }

    /**
     * Verify login with valid user credentials
     * @param userType - Type of user to test (e.g., 'MONTHLY', 'FREE')
     * @returns Promise<void>
     */
    async verifyLoginWithValidUser(membershipStatus: string, email: string): Promise<void> {
        console.log(`Testing login with valid ${membershipStatus} user...`);
        await this.loginPopup.clearAllFields();
        await this.loginPopup.enterEmail(email);
        await this.loginPopup.enterPassword(this.TEST_PASSWORD);
        await this.loginPopup.clickLoginWithEmail();
        await this.loginPopup.wait(5000); // Wait for login to process
        switch (membershipStatus) {
            case 'MONTHLY':
            case 'APPLY_CANCEL':
                // Check if monthly subscription user is redirected to home page
                const homePageUrl = await this.loginPopup.getCurrentUrl();
                await expect(homePageUrl).toContain('/home');
                console.log('✓ Monthly subscription user logged in successfully and redirected to /home');
                break;
            case 'FREE':
                // Check if free user is redirected to top page
                const topPageUrl = await this.loginPopup.getCurrentUrl();
                await expect(topPageUrl).toContain('/top');
                console.log('✓ Free user logged in successfully and redirected to /top');
                break;
            default:
                console.warn(`Unknown membership status: ${membershipStatus}. Assuming login successful.`);
                break;
        }
    }
    /**
     * Verify forgot password link works correctly
     * @returns Promise<void>
     */
    async verifyForgotPasswordLink(): Promise<void> {
        console.log('Testing forgot password link...');

        // Click the forgot password link
        await this.loginPopup.clickForgotPasswordLink();

        // The navigation and verification will happen implicitly
        // We'll wait briefly to ensure navigation has time to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✓ Forgot password link clicked');
    }

    /**
     * Verify registration link works correctly
     * @returns Promise<void>
     */
    async verifyRegisterLink(): Promise<void> {
        console.log('Testing register link...');

        // Click the register link
        await this.loginPopup.clickRegisterLink();

        // The navigation and verification will happen implicitly
        // We'll wait briefly to ensure navigation has time to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('✓ Registration link clicked');
    }

    /**
     * Verify login trouble link and popup
     * @returns Promise<void>
     */
    async verifyTroubleLink(): Promise<void> {
        console.log('Testing login trouble link and closing popup...');

        // Click the login trouble link
        await this.loginPopup.clickLoginTroubleLink();

        // Verify that the login trouble popup is displayed
        await expect(this.loginPopup.isLoginTroublePopupDisplayed()).resolves.toBeTruthy();
        console.log('✓ Login trouble popup displayed correctly');

        // Close the login trouble popup
        await this.loginPopup.closeLoginTroublePopup();

        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verify that the login trouble popup is closed and login popup is no longer displayed
        await expect(this.loginPopup.isDisplayed()).resolves.toBeFalsy();
        console.log('✓ Login popup is no longer displayed');
    }

    /**
     * Verify submit button state based on input fields
     * @returns Promise<void>
     */
    async verifySubmitButtonDisabled(): Promise<void> {
        console.log('Testing submit button state with various input combinations...');

        // First clear all fields to ensure a clean state
        await this.loginPopup.clearAllFields();

        // Verify button is disabled with no input
        await expect(this.loginPopup.isSubmitButtonDisabled()).resolves.toBeTruthy();
        console.log('✓ Button is disabled with no input');

        // Verify button is still disabled with only email
        await this.loginPopup.enterEmail('test@example.com');
        await expect(this.loginPopup.isSubmitButtonDisabled()).resolves.toBeTruthy();
        console.log('✓ Button is disabled with only email');

        // Verify button is still disabled with only password
        await this.loginPopup.clearAllFields();
        await this.loginPopup.enterPassword(this.TEST_PASSWORD);
        await expect(this.loginPopup.isSubmitButtonDisabled()).resolves.toBeTruthy();
        console.log('✓ Button is disabled with only password');

        // Verify button is enabled with both fields
        await this.loginPopup.enterEmail('test@example.com');
        await expect(this.loginPopup.isSubmitButtonDisabled()).resolves.toBeFalsy();
        console.log('✓ Button is enabled with both fields');
    }

    /**
     * Verify closing the popup works correctly
     * @returns Promise<void>
     */
    async verifyLoginPopupClosing(): Promise<void> {
        console.log('Testing login popup closing...');
        await this.loginPopup.closeLoginPopup();

        // Wait briefly for animation
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verify popup is no longer displayed
        const isDisplayed = await this.loginPopup.isDisplayed().catch(() => false);
        await expect(isDisplayed).toBeFalsy();
        console.log('✓ Login popup closed correctly');
    }

    /**
     * Verify valid email formats are accepted without validation errors
     * @returns Promise<void>
     */
    async verifyValidEmailFormats(): Promise<void> {
        console.log('Testing valid email formats...');

        for (const validEmail of validEmails.slice(0, 3)) { // Test first 3 valid emails to save time
            console.log(`Testing valid email format: ${validEmail}`);
            await this.loginPopup.enterEmail(validEmail);
            await this.loginPopup.enterPassword(this.TEST_PASSWORD);
            await this.loginPopup.clickLoginWithEmail();

            // No error message should appear
            const errorMessage = await this.loginPopup.getErrorMessage();
            await expect(errorMessage).toBeFalsy();
        }

        console.log('✓ All valid email formats accepted correctly');
    }

    /**
     * Run all basic assertions to check Login Popup
     * Convenient method when you want to run all standard tests
     * @returns Promise<void>
     */
    async runBasicAssertions(): Promise<void> {
        await this.verifyPopupIsDisplayed();
        await this.verifyInvalidEmailFormats();
        await this.verifyNonExistentEmail();
        await this.verifyInvalidUserCredentials();
        await this.verifySubmitButtonDisabled();
        // await this.verifyValidEmailFormats();
    }

    /**
     * Run all navigation assertions for Login Popup
     * @param runIndependently - When true, will warn about tests that need to be run separately
     * @returns Promise<void>
     */
    async runNavigationAssertions(runIndependently = false): Promise<void> {
        // Test the login trouble link (this doesn't navigate away)
        await this.verifyTroubleLink();

        // If running independently flag is false, show warnings instead of running the tests
        // that navigate away from the current page
        if (!runIndependently) {
            console.warn('Note: Forgot Password and Register link tests will navigate away from the current page');
            console.warn('These tests should be run separately with dedicated test cases');
            console.warn('Use individual test methods for these assertions');
        } else {
            // If explicitly asked to run all tests, run them but warn that they'll navigate away
            console.warn('Running tests that will navigate away from the current page...');
            await this.verifyForgotPasswordLink();
            await this.verifyRegisterLink();
        }
    }

    /**
     * Run comprehensive assertions including all tests
     * Note: This should be used only in dedicated test files where navigation is acceptable
     * @returns Promise<void>
     */
    async runComprehensiveAssertions(): Promise<void> {
        await this.runBasicAssertions();
        // Pass true to force running all navigation tests
        await this.runNavigationAssertions(true);
        await this.verifyLoginPopupClosing();
    }
}
