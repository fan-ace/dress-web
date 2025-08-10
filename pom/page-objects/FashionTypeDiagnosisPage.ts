import { Locator, Page } from '@playwright/test';
import BasePage from '@pom/common/BasePage';
import { TopPage, TopPageButton } from './TopPage';
import { LoginPopup } from './LoginPopup';
import { LoginPopupContext } from './login-popups/LoginPopupFactory';
import { WebActions } from '@pom/common/WebActions';
import env from '@helpers/EnvHelper';

export enum FashionTypeDiagnosisPageButton {
    START_DIAGNOSIS = '診断をはじめる',
    LOGIN = 'ログイン',
}
/**
 * Page object representing the Fashion Type Diagnosis page
 * This page is accessed from the top page by clicking on the "無料診断を始める" button
 */
export class FashionTypeDiagnosisPage extends BasePage {
    static gotoFromUrl() {
        throw new Error('Method not implemented.');
    }
    static clickStartDiagnosisButton() {
        throw new Error('Method not implemented.');
    }
    // Page dependencies
    readonly topPage: TopPage;
    readonly loginPopup: LoginPopup;
    private readonly url: string;

    // Locators - defined at the top for better maintainability
    private readonly pageTitle: Locator;
    private readonly webActions: WebActions;
    private readonly startFreeDiagnosisButton: Locator;
    private readonly loginButton: Locator;


    constructor(page: Page) {
        super(page);
        this.topPage = new TopPage(page);
        this.loginPopup = new LoginPopup(page, LoginPopupContext.FASHION_TYPE_DIAGNOSIS);
        this.webActions = new WebActions(page);
        this.url = env.get('BASE_URL') + '/fashion-type-diagnosis/'; // Base URL for this page

        // Initialize locators
        this.pageTitle = this.page.getByText('診断後にサービスをご利用できます');
        this.startFreeDiagnosisButton = this.page.getByRole('button', { name: '診断をはじめる' });
        this.loginButton = this.page.getByText('ログイン');
    }

    /**
     * Navigate to Fashion Type Diagnosis Page by going to TopPage first
     * and then clicking the "無料診断を始める" (Start Free Diagnosis) button
     * @returns Promise<void>
     */
    async gotoFromUrl(): Promise<void> {
        try {
            await this.page.goto(this.url);
            await this.page.waitForLoadState('networkidle');
            await this.closeHeaderBanner();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to navigate to Fashion Type Diagnosis page: ${errorMessage}`);
        }
    }

    /**
     * Navigate to FashionTypeDiagnosisPage by going to TopPage first
     * and then clicking the "無料診断を始める" (Start Free Diagnosis) button
     * @returns Promise<void>
     */
    async gotoFromTopPage(): Promise<void> {
        try {
            // First navigate to TopPage
            await this.topPage.goto();

            // Then click on "無料診断を始める" button to reach the FashionTypeDiagnosisPage
            await this.topPage.clickButton(TopPageButton.START_FREE_DIAGNOSIS);
            await this.closeHeaderBanner();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to navigate to Fashion Type Diagnosis page: ${errorMessage}`);
        }
    }

    /**
     * Click the "診断をはじめる" button (Start Diagnosis)
     */
    async clickStartDiagnosisButton(): Promise<void> {
        await this.webActions.safeClick(this.startFreeDiagnosisButton);
        // Optionally wait for the page to load or for a specific element to appear
        // await this.page.waitForLoadState('networkidle');
    }
    /**
     * Click the "ログイン" button
     */
    async clickLoginButton(): Promise<void> {
        await this.webActions.safeClick(this.loginButton);
        await this.page.waitForTimeout(1000); // Wait for the login popup to appear
    }
    /**
     * Click a button on the Fashion Type Diagnosis page using the FashionTypeDiagnosisPageButton enum
     * @param button - The button to click
     */
    async clickButton(button: FashionTypeDiagnosisPageButton): Promise<void> {
        switch (button) {
            case FashionTypeDiagnosisPageButton.START_DIAGNOSIS:
                await this.clickStartDiagnosisButton();
                break;
            case FashionTypeDiagnosisPageButton.LOGIN:
                await this.clickLoginButton();
                break;
            default:
                throw new Error(`Button ${button} not supported on Fashion Type Diagnosis page`);
        }
    }

    /**
     * Get the page URL
     * @returns The URL of the current page
     */
    getPageUrl(): string {
        return this.page.url();
    }

}
export default FashionTypeDiagnosisPage;