import { Page } from '@playwright/test';
import { BaseLoginPopup } from './login-popups/BaseLoginPopup';
import { LoginPopupContext, LoginPopupFactory } from './login-popups/LoginPopupFactory';

/**
 * Component object representing the Login Popup
 * This popup is a reusable component that appears in multiple pages
 * @remarks
 * This component follows the Page Object Model pattern and provides methods
 * to interact with the login popup and verify its functionality
 * 
 * This is a facade class that delegates to the appropriate implementation
 * based on the current page context
 */
export class LoginPopup {
    private loginPopup: BaseLoginPopup;
    private readonly page: Page;

    /**
     * Create a new LoginPopup instance
     * @param page - Playwright Page object
     * @param context - Optional context to specify which page the popup is on
     */
    constructor(page: Page, context?: LoginPopupContext) {
        this.page = page;

        if (context) {
            // Use the specified context if provided
            this.loginPopup = LoginPopupFactory.create(page, context);
        } else {
            // Default to TopPage implementation
            // Will be updated with auto-detection when needed
            this.loginPopup = LoginPopupFactory.create(page, LoginPopupContext.TOP_PAGE);
        }
    }

    async wait(timeout: number = 5000): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Update the implementation based on the current page URL
     * Call this method before interacting with the popup if the context may have changed
     */
    async updateImplementationFromCurrentPage(): Promise<void> {
        this.loginPopup = await LoginPopupFactory.createFromCurrentPage(this.page);
    }

    // Delegate all methods to the actual implementation

    async isDisplayed(): Promise<boolean> {
        return this.loginPopup.isDisplayed();
    }

    async enterEmail(email: string): Promise<void> {
        await this.loginPopup.enterEmail(email);
    }

    async enterPassword(password: string): Promise<void> {
        await this.loginPopup.enterPassword(password);
    }

    async clearEmail(): Promise<void> {
        await this.loginPopup.clearEmail();
    }

    async clearPassword(): Promise<void> {
        await this.loginPopup.clearPassword();
    }

    async clearAllFields(): Promise<void> {
        await this.loginPopup.clearAllFields();
    }

    async clickLoginTroubleLink(): Promise<void> {
        await this.loginPopup.clickLoginTroubleLink();
    }

    async isLoginTroublePopupDisplayed(): Promise<boolean> {
        return await this.loginPopup.isLoginTroublePopupDisplayed();
    }

    async closeLoginTroublePopup(): Promise<void> {
        await this.loginPopup.closeLoginTroublePopup();
    }

    async closeLoginPopup(): Promise<void> {
        await this.loginPopup.closeLoginPopup();
    }

    async clickForgotPasswordLink(): Promise<void> {
        await this.loginPopup.clickForgotPasswordLink();
    }

    async clickRegisterLink(): Promise<void> {
        await this.loginPopup.clickRegisterLink();
    }

    async clickLoginWithEmail(): Promise<void> {
        await this.loginPopup.clickLoginWithEmail();
    }

    async getErrorMessage(): Promise<string> {
        return await this.loginPopup.getErrorMessage();
    }

    async getLoginFailMessage(): Promise<string> {
        return await this.loginPopup.getLoginFailMessage();
    }

    async isSubmitButtonDisabled(): Promise<boolean> {
        return await this.loginPopup.isSubmitButtonDisabled();
    }

    /**
     * Get the current page URL
     * @returns Promise<string> - The current URL
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }
}
