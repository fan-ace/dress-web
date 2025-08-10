import { Locator, Page } from '@playwright/test';
import { BaseLoginPopup } from './BaseLoginPopup';

/**
 * Implementation of LoginPopup for TopPage
 * This class provides the specific locators for the login popup when it appears on the TopPage
 */
export class TopPageLoginPopup extends BaseLoginPopup {
    // Popup UI elements
    protected readonly popupTitle: Locator;
    protected readonly closeLoginPopupButton: Locator;
    protected readonly loginTroublePopup: Locator;
    protected readonly closeNoteModalButton: Locator;

    // Form inputs
    protected readonly emailInput: Locator;
    protected readonly passwordInput: Locator;
    protected readonly submitButton: Locator;

    // Navigation links
    protected readonly loginTroubleLink: Locator;
    protected readonly forgotPasswordLink: Locator;
    protected readonly registerLink: Locator;
    protected readonly loginWithEmailButton: Locator;

    // Error messages
    protected readonly errorMessage: Locator;
    protected readonly loginFailMessage: Locator;

    /**
     * Create a new TopPageLoginPopup instance
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        super(page);

        // Initialize locators specific to TopPage

        // Popup UI elements
        this.popupTitle = this.page.locator('#loginModal').getByText('ログイン', { exact: true });
        this.closeLoginPopupButton = this.page.locator('#closeLoginModal');
        this.loginTroublePopup = this.page.getByText('ログインに関しての注意事項');
        this.closeNoteModalButton = this.page.locator('#closeLoginNotesModal');

        // Form inputs
        this.emailInput = this.page.getByRole('textbox', { name: 'メールアドレス' });
        this.passwordInput = this.page.getByRole('textbox', { name: 'パスワード' });
        this.submitButton = this.page.getByRole('button', { name: 'メールでログイン' });

        // Navigation links
        this.loginTroubleLink = this.page.locator('span').filter({ hasText: 'こちら' });
        this.forgotPasswordLink = this.page.getByRole('listitem').filter({ hasText: 'パスワードをお忘れの方はこちら' }).getByRole('link');
        this.registerLink = this.page.getByRole('listitem').filter({ hasText: '初めてのご利用ですか？無料会員登録はこちら' }).getByRole('link');
        this.loginWithEmailButton = this.page.getByRole('button', { name: 'メールでログイン' });

        // Error messages
        this.errorMessage = this.page.getByText(BaseLoginPopup.ERROR_MESSAGES.INVALID_EMAIL);
        this.loginFailMessage = this.page.getByText(BaseLoginPopup.ERROR_MESSAGES.LOGIN_FAILED);
    }
}
