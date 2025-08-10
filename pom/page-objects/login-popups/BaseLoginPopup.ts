import { Locator, Page, expect } from '@playwright/test';
import { invalidEmails, loginCredentials } from '../../../test-data/TestEmailData';
import BasePage from '../../common/BasePage';

/**
 * Abstract base class for LoginPopup implementations
 * This defines the common interface and functionality for all login popup variants
 * @remarks
 * Different pages may have different selectors for the same logical elements
 * This class enables consistent behavior across all implementations
 */
export abstract class BaseLoginPopup extends BasePage {
    // Error messages constants
    protected static readonly ERROR_MESSAGES = {
        INVALID_EMAIL: '不正なメールアドレスです。',
        LOGIN_FAILED: 'Eメールアドレスが存在しないか、パスワードが誤っているためログインできません。'
    };

    // Timeouts constants
    protected static readonly TIMEOUTS = {
        ANIMATION_DELAY: 300,
        VALIDATION_WAIT: 500,
        POPUP_WAIT: 10000
    };

    // Popup UI elements - abstract locators to be implemented by subclasses
    protected abstract readonly popupTitle: Locator;
    protected abstract readonly closeLoginPopupButton: Locator;
    protected abstract readonly loginTroublePopup: Locator;
    protected abstract readonly closeNoteModalButton: Locator;

    // Form inputs - abstract locators to be implemented by subclasses
    protected abstract readonly emailInput: Locator;
    protected abstract readonly passwordInput: Locator;
    protected abstract readonly submitButton: Locator;

    // Navigation links - abstract locators to be implemented by subclasses
    protected abstract readonly loginTroubleLink: Locator;
    protected abstract readonly forgotPasswordLink: Locator;
    protected abstract readonly registerLink: Locator;
    protected abstract readonly loginWithEmailButton: Locator;

    // Error messages - abstract locators to be implemented by subclasses
    protected abstract readonly errorMessage: Locator;
    protected abstract readonly loginFailMessage: Locator;

    /**
     * Create a new BaseLoginPopup instance
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        super(page);
    }    /**
     * Check if login popup is displayed
     * @returns Promise resolving to boolean indicating if popup is visible
     */
    async isDisplayed(): Promise<boolean> {
        return await this.actions.isVisible(this.popupTitle);
    }

    /**
     * Enter email in the login form
     * @param email - Email to enter
     */
    async enterEmail(email: string): Promise<void> {
        await this.actions.safeFill(this.emailInput, email);
    }

    /**
     * Enter password in the login form
     * @param password - Password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.actions.safeFill(this.passwordInput, password);
    }

    /**
     * Clear the email input field
     */
    async clearEmail(): Promise<void> {
        await this.emailInput.clear();
    }

    /**
     * Clear the password input field
     */
    async clearPassword(): Promise<void> {
        await this.passwordInput.clear();
    }

    /**
     * Clear both email and password fields
     */
    async clearAllFields(): Promise<void> {
        await this.clearEmail();
        await this.clearPassword();
    }

    /**
     * Click on "うまくログインできない方はこちら" link
     */
    async clickLoginTroubleLink(): Promise<void> {
        await this.actions.safeClick(this.loginTroubleLink);
    }

    /**
     * Check if login note popup is displayed
     * @returns Promise<boolean>
     */
    async isLoginTroublePopupDisplayed(): Promise<boolean> {
        return await this.actions.isVisible(this.loginTroublePopup);
    }
    /**
     * Close the login trouble popup
     */
    async closeLoginTroublePopup(): Promise<void> {
        await this.actions.safeClick(this.closeNoteModalButton);
        await this.actions.wait(BaseLoginPopup.TIMEOUTS.ANIMATION_DELAY); // Wait for the popup to close
    }

    /**
     * Close the popup by clicking X button
     */
    async closeLoginPopup(): Promise<void> {
        await this.actions.safeClick(this.closeLoginPopupButton);
        await this.actions.wait(300); // Small delay to allow animation
    }

    /**
     * Click on "パスワードをお忘れの方はこちら" link
     */
    async clickForgotPasswordLink(): Promise<void> {
        await this.actions.safeClick(this.forgotPasswordLink);
    }

    /**
     * Click on "初めてのご利用ですか？無料会員登録はこちら" link
     */
    async clickRegisterLink(): Promise<void> {
        await this.actions.safeClick(this.registerLink);
    }

    /**
     * Click "メールでログイン" button to login
     */
    async clickLoginWithEmail(): Promise<void> {
        await this.actions.safeClick(this.loginWithEmailButton);
        await this.actions.waitForNavigation();
    }

    /**
     * Get error message if displayed
     * @returns Promise<string> Error message text or empty string
     */
    async getErrorMessage(): Promise<string> {
        return await this.actions.getText(this.errorMessage);
    }

    /**
     * Get login failure message if displayed
     * @returns Promise<string> Login failure message text or empty string
     */
    async getLoginFailMessage(): Promise<string> {
        return await this.actions.getText(this.loginFailMessage);
    }

    /**
     * Check if submit button is disabled
     * @returns Promise<boolean>
     */
    async isSubmitButtonDisabled(): Promise<boolean> {
        return await this.submitButton.isDisabled();
    }

    /**
     * Verify clicking the login trouble link shows the trouble popup
     * @returns Promise resolving when verification is complete
     */
    async verifyClickTroubleLink(): Promise<void> {
        await this.clickLoginTroubleLink();
        // Wait for the login note popup to appear
        await this.actions.wait(BaseLoginPopup.TIMEOUTS.VALIDATION_WAIT);

        // Use Playwright expect for better reporting
        try {
            await expect(this.loginTroublePopup).toBeVisible({
                timeout: BaseLoginPopup.TIMEOUTS.VALIDATION_WAIT
            });
            console.log("Login note popup is displayed.");
        } catch (error) {
            await this.actions.takeScreenshot('trouble-link-error');
            throw new Error("Login note popup did not appear after clicking the trouble link.");
        }
    }

    /**
     * Verify closing the trouble popup works correctly
     * @returns Promise resolving when verification is complete
     */
    async verifyCloseTroublePopup(): Promise<void> {
        await this.closeLoginTroublePopup();
        // Verify the popup is closed
        try {
            await expect(this.popupTitle).toBeHidden({
                timeout: BaseLoginPopup.TIMEOUTS.VALIDATION_WAIT
            });
            console.log("Login popup closed successfully.");
        } catch (error) {
            await this.actions.takeScreenshot('close-popup-error');
            throw new Error("Login popup is still displayed after closing.");
        }
    }

    /**
     * Verify that clicking the forgot password link navigates to the correct page
     * @returns Promise resolving when verification is complete
     */
    async verifyClickForgotPasswordLink(): Promise<void> {
        await this.clickForgotPasswordLink();
        // Wait for the forgot password page to load
        await this.actions.waitForNavigation();

        // Verify we're on the forgot password page
        try {
            await expect(this.page).toHaveURL(/.*\/forget-password/);
            console.log("Navigated to forgot password page successfully.");
        } catch (error) {
            await this.actions.takeScreenshot('forgot-password-navigation-error');
            throw new Error("Did not navigate to forgot password page after clicking the link.");
        }
    }

    /**
     * Verify that clicking the register link navigates to the correct page
     * @returns Promise resolving when verification is complete
     */
    async verifyClickRegisterLink(): Promise<void> {
        await this.clickRegisterLink();
        // Wait for the registration page to load
        await this.actions.waitForNavigation();

        // Verify we're on the registration page
        try {
            await expect(this.page).toHaveURL(/.*\/fashion-type-diagnosis/);
            console.log("Navigated to registration page successfully.");
        } catch (error) {
            await this.actions.takeScreenshot('register-navigation-error');
            throw new Error("Did not navigate to registration page after clicking the link.");
        }
    }

    /**
     * Enter invalid email and validate error message
     * @param email - Invalid email to test
     * @param password - Password to use for testing
     * @returns Promise resolving to the error message displayed
     */
    async testSingleInvalidEmail(email: string, password: string): Promise<string> {
        console.log(`Testing invalid email: ${email}`);
        await this.enterEmail(email);
        await this.enterPassword(password);

        // Wait for the error message to appear
        await this.actions.wait(BaseLoginPopup.TIMEOUTS.VALIDATION_WAIT);

        // Get error message
        const errorMessage = await this.getErrorMessage();

        // Clear the form for potential next test
        await this.emailInput.clear();
        await this.passwordInput.clear();

        return errorMessage;
    }

    /**
     * Verify login with all invalid emails from email-validation-data.ts
     * @param password - Password to use for all login attempts
     */
    async verifyLoginWithInvalidEmails(password: string): Promise<void> {
        for (const email of invalidEmails) {
            const errorMessage = await this.testSingleInvalidEmail(email, password);

            if (errorMessage === '') {
                await this.actions.takeScreenshot(`invalid-email-${email}`);
                throw new Error(`Expected error message for invalid email "${email}" did not appear.`);
            } else {
                console.log(`Email "${email}": ${errorMessage}`);
            }
        }
        console.log("All invalid email tests completed successfully");
    }

    /**
     * Attempt login with given credentials and return the failure message if any
     * @param email - Email to attempt login with
     * @param password - Password to attempt login with
     * @returns Promise resolving to the login failure message or empty string if no message
     */
    async attemptLoginAndGetFailureMessage(email: string, password: string): Promise<string> {
        console.log(`Attempting login with email: ${email}`);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginWithEmail();

        // Wait for the login failure message to appear
        await this.actions.wait(BaseLoginPopup.TIMEOUTS.VALIDATION_WAIT);

        return await this.getLoginFailMessage();
    }

    /**
     * Verify login with non-existent email
     * Expected result is to show the login failure message
     * @param email - Valid formatted but non-existent email
     * @param password - Password to use for login attempt
     */
    async verifyLoginWithNonExistentEmail(email: string, password: string): Promise<void> {
        const failMessage = await this.attemptLoginAndGetFailureMessage(email, password);

        if (failMessage === '') {
            await this.actions.takeScreenshot(`non-existent-email-${email}`);
            throw new Error(`Expected login failure message for non-existent email "${email}" did not appear.`);
        } else {
            console.log(`Login failure message for non-existent email "${email}": ${failMessage}`);
            // Verify the message matches the expected error
            expect(failMessage).toContain(BaseLoginPopup.ERROR_MESSAGES.LOGIN_FAILED);
        }
    }

    /**
     * Verify login with the predefined invalid user credentials from loginCredentials
     * Expected result is to show the login failure message
     */
    async verifyLoginWithPredefinedInvalidUser(): Promise<void> {
        const { email, password } = loginCredentials.invalidUser;

        const failMessage = await this.attemptLoginAndGetFailureMessage(email, password);

        if (failMessage === '') {
            await this.actions.takeScreenshot('invalid-user-login');
            throw new Error(`Expected login failure message for predefined invalid user did not appear.`);
        } else {
            console.log(`Login failure message for predefined invalid user: ${failMessage}`);
            // Verify the message matches the expected error
            expect(failMessage).toContain(BaseLoginPopup.ERROR_MESSAGES.LOGIN_FAILED);
        }
    }
}
