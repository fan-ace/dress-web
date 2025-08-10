import { Locator, Page } from '@playwright/test';
import BasePage from '@pom/common/BasePage';
import { TopPage, TopPageButton } from './TopPage';
import { LoginPopup } from './LoginPopup';
import { LoginPopupContext } from './login-popups/LoginPopupFactory';
import { WebActions } from '@pom/common/WebActions';
import env from '@helpers/EnvHelper';

export enum FashionTypeDiagnosisGuidePageButton {
    START_DIAGNOSIS = 'ファッション診断へ',
    LOGIN = 'ログイン',
}
/**
 * Page object representing the Fashion Type Diagnosis Guide page
 * This page is accessed from the Top page by clicking on "今すぐエアクロを始める" button
 */
export class FashionTypeDiagnosisGuidePage extends BasePage {
    // Page dependencies
    readonly topPage: TopPage;
    readonly loginPopup: LoginPopup;
    readonly webActions: WebActions;
    private readonly url: string;

    // Locators - defined at the top for better maintainability
    private readonly pageTitle: Locator;
    private readonly startButton: Locator;
    private readonly loginButton: Locator;

    /**
     * Create a new FashionTypeDiagnosisGuidePage instance
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        super(page);
        this.topPage = new TopPage(page);
        this.loginPopup = new LoginPopup(page, LoginPopupContext.FASHION_TYPE_DIAGNOSIS_GUIDE);
        this.webActions = new WebActions(page);
        this.url = env.get('BASE_URL') + '/fashion-type-diagnosis/guide/'; // Base URL for this page

        // Initialize locators
        this.pageTitle = this.page.getByText('似合うコーデをお届けする');
        this.startButton = this.page.getByRole('button', { name: 'ファッション診断へ' }); // "Start Diagnosis" button
        this.loginButton = this.page.getByRole('button', { name: 'ログイン' });
    }

    /**
     * Navigate to Fashion Type Diagnosis Guide Page by going to TopPage first
     * and then clicking the "今すぐエアクロを始める" (Start Aircloset Now) button
     * @returns Promise<void>
     */
    async gotoFromUrl(): Promise<void> {
        try {
            await this.page.goto(this.url);
            await this.page.waitForLoadState('networkidle');
            await this.closeHeaderBanner();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to navigate to Fashion Type Diagnosis Guide page: ${errorMessage}`);
        }
    }

    /**
     * Navigate to Fashion Type Diagnosis Guide Page by going to TopPage first
     * and then clicking the "今すぐエアクロを始める" (Start Aircloset Now) button
     * @returns Promise<void>
     */
    async gotoFromTopPage(): Promise<void> {
        try {
            // First navigate to TopPage
            await this.topPage.goto();

            // Then click on "今すぐエアクロを始める" button to reach this page
            await this.topPage.clickButton(TopPageButton.START_AIRCLOSET_NOW);
            await this.page.waitForTimeout(1000); // Wait for navigation to complete
            await this.closeHeaderBanner();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to navigate to Fashion Type Diagnosis Guide page: ${errorMessage}`);
        }
    }

    /**
     * Click the "診断を始める" (Start Diagnosis) button to proceed
     * @returns Promise<void>
     */
    async clickStartButton(): Promise<void> {
        await this.webActions.safeClick(this.startButton);
    }

    /**
     * Click the "ログイン" (Login) button to open the login popup
     * @returns Promise<void>
     */
    async clickLoginButton(): Promise<void> {
        await this.webActions.safeClick(this.loginButton);
    }

    async clickButton(button: FashionTypeDiagnosisGuidePageButton): Promise<void> {
        switch (button) {
            case FashionTypeDiagnosisGuidePageButton.START_DIAGNOSIS:
                await this.clickStartButton();
                break;
            case FashionTypeDiagnosisGuidePageButton.LOGIN:
                await this.clickLoginButton();
                break;
            default:
                throw new Error(`Unsupported button: ${button}`);
        }
    }
}
export default FashionTypeDiagnosisGuidePage;
