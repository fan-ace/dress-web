import { Locator, Page } from '@playwright/test';
import { BaseLoginPopup } from './BaseLoginPopup';

/**
 * Implementation of LoginPopup for FashionTypeDiagnosisGuidePage
 * This class provides the specific locators for the login popup when it appears on the FashionTypeDiagnosisGuidePage
 */
export class FashionTypeDiagnosisGuideLoginPopup extends BaseLoginPopup {
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
     * Create a new FashionTypeDiagnosisGuideLoginPopup instance
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        super(page);

        // Initialize locators specific to FashionTypeDiagnosisGuidePage

        // Popup UI elements - these could be different from TopPage
        this.popupTitle = this.page.getByLabel('Modal').getByText('ログイン', { exact: true });
        this.closeLoginPopupButton = this.page.getByText('×');
        this.loginTroublePopup = this.page.getByText('ログインに関しての注意事項');
        this.closeNoteModalButton = this.page.getByText('×');

        // Form inputs - adjust selectors as needed for this page
        this.emailInput = this.page.getByPlaceholder('メールアドレス');
        this.passwordInput = this.page.getByPlaceholder('パスワード');
        this.submitButton = this.page.getByRole('button', { name: 'メールでログイン' });

        // Navigation links - adjust selectors as needed for this page
        this.loginTroubleLink = this.page.locator('span').filter({ hasText: 'こちら' });
        this.forgotPasswordLink = this.page.locator('li').filter({ hasText: 'パスワードをお忘れの方はこちら' }).locator('a');
        this.registerLink = this.page.locator('li').filter({ hasText: '初めてのご利用ですか？無料会員登録はこちら' }).locator('a');
        this.loginWithEmailButton = this.page.getByText('メールでログイン');

        // Error messages - adjust selectors as needed for this page
        this.errorMessage = this.page.getByText(BaseLoginPopup.ERROR_MESSAGES.INVALID_EMAIL);
        this.loginFailMessage = this.page.getByText(BaseLoginPopup.ERROR_MESSAGES.LOGIN_FAILED);
    }
}
