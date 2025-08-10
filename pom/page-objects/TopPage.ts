import { Locator, Page } from '@playwright/test';
import BasePage from '@pom/common/BasePage';
import * as dotenv from 'dotenv';
import { WebActions } from '@pom/common/WebActions';
import { LoginPopup } from './LoginPopup';
import { LoginPopupContext } from './login-popups/LoginPopupFactory';

dotenv.config();

/**
 * Button names/actions to make it easier to reference in tests
 */
export enum TopPageButton {
    START_FREE_DIAGNOSIS = '無料診断を始める',
    START_AIRCLOSET_NOW = '今すぐエアクロを始める',
    LOGIN_TEXTLINK = 'ログイン',
    LOGIN_BUTTON = 'ログイン',
    MENU_BUTTON = 'メニュー',
}

/**
 * Page object representing the top/home page of the application
 */
export class TopPage extends BasePage {
    // Locators - defined at the top for better maintainability
    private readonly startFreeDiagnosisButton: Locator;
    private readonly startAirclosetNowButton: Locator;
    private readonly pageTitle: Locator;
    private readonly loginTextLink: Locator;
    private readonly loginButton: Locator;
    private readonly menuButton: Locator;

    readonly loginPopup: LoginPopup;

    constructor(page: Page) {
        super(page);
        // Initialize locators in constructor
        this.startFreeDiagnosisButton = this.page.locator('section').filter({ hasText: 'プロが選ぶ、コーデが届く。 無料診断を始める 今すぐエアクロを始める' }).getByRole('link').first();
        this.pageTitle = this.page.getByText('プロのスタイリストが"あなたのため"に選んだコーデをご自宅へ');
        this.startAirclosetNowButton = this.page.locator('section').filter({ hasText: 'プロが選ぶ、コーデが届く。 無料診断を始める 今すぐエアクロを始める' }).getByRole('link').nth(1);
        this.loginTextLink = this.page.getByRole('main').getByText('ログイン');
        this.loginButton = this.page.getByRole('img', { name: 'ログイン' });
        this.menuButton = this.page.getByRole('img', { name: 'メニュー' });
        this.loginPopup = new LoginPopup(page, LoginPopupContext.TOP_PAGE);
    }

    /**
     * Navigate to the top page using the BASE_URL environment variable
     * @throws Error if BASE_URL is not defined
     */
    async goto(): Promise<void> {
        if (!process.env.BASE_URL) {
            throw new Error('Environment variable BASE_URL is not defined');
        }

        await this.page.goto(process.env.BASE_URL);
    }

    /**
     * Click the "無料診断を始める" button (Start Free Diagnosis)
     */
    async clickStartFreeDiagnosisButton(): Promise<void> {
        await this.actions.safeClick(this.startFreeDiagnosisButton);
        // await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the "今すぐエアクロを始める" button (Start Aircloset Now)
     */
    async clickStartAirclosetNowButton(): Promise<void> {
        await this.actions.safeClick(this.startAirclosetNowButton);
        // await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the "ログイン" text link
     */
    async clickLoginTextLink(): Promise<void> {
        await this.actions.safeClick(this.loginTextLink);
        // await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the "ログイン" button
     */
    async clickLoginButton(): Promise<void> {
        await this.actions.safeClick(this.loginButton);
        // await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click the "メニュー" button
     */
    async clickMenuButton(): Promise<void> {
        await this.actions.safeClick(this.menuButton);
        // await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click a button on the top page using the TopPageButton enum
     */
    async clickButton(button: TopPageButton): Promise<void> {
        switch (button) {
            case TopPageButton.START_FREE_DIAGNOSIS:
                await this.clickStartFreeDiagnosisButton();
                break;
            case TopPageButton.START_AIRCLOSET_NOW:
                await this.clickStartAirclosetNowButton();
                break;
            case TopPageButton.LOGIN_TEXTLINK:
                await this.clickLoginTextLink();
                break;
            case TopPageButton.LOGIN_BUTTON:
                await this.clickLoginButton();
                break;
            case TopPageButton.MENU_BUTTON:
                await this.clickMenuButton();
                break;
            default:
                throw new Error(`Button ${button} not supported on TopPage`);
        }
    }
}
