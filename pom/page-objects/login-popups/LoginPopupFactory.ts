import { Page } from '@playwright/test';
import { BaseLoginPopup } from './BaseLoginPopup';
import { TopPageLoginPopup } from './TopPageLoginPopup';
import { FashionTypeDiagnosisLoginPopup } from './FashionTypeDiagnosisLoginPopup';
import { FashionTypeDiagnosisGuideLoginPopup } from './FashionTypeDiagnosisGuideLoginPopup';

/**
 * Enum representing the different page contexts for login popups
 */
export enum LoginPopupContext {
    TOP_PAGE = 'top-page',
    FASHION_TYPE_DIAGNOSIS = 'fashion-type-diagnosis',
    FASHION_TYPE_DIAGNOSIS_GUIDE = 'fashion-type-diagnosis-guide',
    // Add more contexts as needed
}

/**
 * Factory class for creating the appropriate LoginPopup implementation
 * based on the current page context
 */
export class LoginPopupFactory {
    /**
     * Create a LoginPopup instance for the specified context
     * @param page - Playwright Page object
     * @param context - The page context for which to create the login popup
     * @returns The appropriate LoginPopup implementation
     */
    static create(page: Page, context: LoginPopupContext): BaseLoginPopup {
        switch (context) {
            case LoginPopupContext.TOP_PAGE:
                return new TopPageLoginPopup(page);
            case LoginPopupContext.FASHION_TYPE_DIAGNOSIS:
                return new FashionTypeDiagnosisLoginPopup(page);
            case LoginPopupContext.FASHION_TYPE_DIAGNOSIS_GUIDE:
                return new FashionTypeDiagnosisGuideLoginPopup(page);
            default:
                // Default to TopPage implementation if context is unknown
                console.warn(`Unknown context '${context}', defaulting to TopPage implementation`);
                return new TopPageLoginPopup(page);
        }
    }

    /**
     * Auto-detect the current page context and create the appropriate LoginPopup implementation
     * @param page - Playwright Page object
     * @returns The appropriate LoginPopup implementation
     */
    static async createFromCurrentPage(page: Page): Promise<BaseLoginPopup> {
        const currentUrl = page.url();

        if (currentUrl.includes('/fashion-type-diagnosis/guide')) {
            return new FashionTypeDiagnosisGuideLoginPopup(page);
        } else if (currentUrl.includes('/fashion-type-diagnosis')) {
            return new FashionTypeDiagnosisLoginPopup(page);
        } else {
            // Default to TopPage implementation
            return new TopPageLoginPopup(page);
        }
    }
}
