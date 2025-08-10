import { test as base } from '@playwright/test';
import { LoginPopupAssertions } from '../pom/assertions/LoginPopupAssertions';
import { TopPage, TopPageButton } from '../pom/page-objects/TopPage';
import { FashionTypeDiagnosisGuidePage, FashionTypeDiagnosisGuidePageButton } from '../pom/page-objects/FashionTypeDiagnosisGuidePage';
import { FashionTypeDiagnosisPage, FashionTypeDiagnosisPageButton } from '../pom/page-objects/FashionTypeDiagnosisPage';
import { DatabaseConnector } from '@helpers/DatabaseConnector';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Define sources for opening the login popup (source screens)
export type LoginPopupSource = 'top-page' | 'fashion-diagnosis' | 'fashion-diagnosis-guide';

// Create an interface for the fixture
type LoginPopupAssertionFixture = {
    // Function that returns appropriate LoginAssertions based on the source
    loginAssertions: LoginPopupAssertions;
    dbAcConnector: DatabaseConnector;
    // Function to get login assertions for a specific source
    getLoginAssertions: (source?: LoginPopupSource) => LoginPopupAssertions;
    topPage: TopPage;
    fashionTypeDiagnosisPage: FashionTypeDiagnosisPage;
    fashionTypeDiagnosisGuidePage: FashionTypeDiagnosisGuidePage;
    // Utility function to navigate to a page and open the login popup
    openLoginPopupFromSource: (source: LoginPopupSource) => Promise<void>;
};

// Create extended test fixture
export const test = base.extend<LoginPopupAssertionFixture>({
    // Database connector fixture
    dbAcConnector: async ({ }, use) => {
        // Check if SSH_PRIVATE_KEY_PATH exists
        if (!process.env.SSH_PRIVATE_KEY_PATH) {
            throw new Error('SSH_PRIVATE_KEY_PATH is not defined in .env file');
        }

        // Verify private key path
        const keyPath = process.env.SSH_PRIVATE_KEY_PATH;
        console.log('SSH Key Path:', keyPath);

        // Check if path exists
        if (!fs.existsSync(keyPath)) {
            throw new Error(`SSH private key not found at path: ${keyPath}`);
        }

        // Check if path is a directory or file
        const stats = fs.statSync(keyPath);
        let privateKey;

        // If it's a file, read directly as string
        privateKey = fs.readFileSync(keyPath, 'utf8');

        const sshConfig = {
            host: process.env.SSH_HOST || '',
            port: Number(process.env.SSH_PORT || '22'),
            username: process.env.SSH_USERNAME || '',
            privateKey: privateKey,
        };

        const dbConfig = {
            host: process.env.DB_HOST!,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
        };

        const dbAirclosetConnector = new DatabaseConnector(sshConfig, dbConfig);
        await dbAirclosetConnector.connect();

        // Use dbAirclosetConnector in test
        await use(dbAirclosetConnector);

        // Close connection after test is complete
        await dbAirclosetConnector.close();
    },

    // Define objects for fixtures
    topPage: async ({ page }, use) => {
        const topPage = new TopPage(page);
        await use(topPage);
    },

    fashionTypeDiagnosisPage: async ({ page }, use) => {
        const fashionTypeDiagnosisPage = new FashionTypeDiagnosisPage(page);
        await use(fashionTypeDiagnosisPage);
    },

    fashionTypeDiagnosisGuidePage: async ({ page }, use) => {
        const fashionTypeDiagnosisGuidePage = new FashionTypeDiagnosisGuidePage(page);
        await use(fashionTypeDiagnosisGuidePage);
    },

    // Function to get LoginAssertions for a specific source
    getLoginAssertions: async ({ page, topPage, fashionTypeDiagnosisPage, fashionTypeDiagnosisGuidePage }, use) => {
        const getLoginAssertionsFunction = (source?: LoginPopupSource): LoginPopupAssertions => {
            if (!source) {
                // Default to TopPage if no source is provided
                return new LoginPopupAssertions(topPage.loginPopup);
            }

            switch (source) {
                case 'top-page':
                    return new LoginPopupAssertions(topPage.loginPopup);
                case 'fashion-diagnosis':
                    return new LoginPopupAssertions(fashionTypeDiagnosisPage.loginPopup);
                case 'fashion-diagnosis-guide':
                    return new LoginPopupAssertions(fashionTypeDiagnosisGuidePage.loginPopup);
                default:
                    throw new Error(`Unsupported login popup source: ${source}`);
            }
        };

        await use(getLoginAssertionsFunction);
    },

    // LoginAssertions is a utility that will be dynamically created based on popup source
    // Default to TopPage for backward compatibility
    loginAssertions: async ({ getLoginAssertions }, use) => {
        // Initialize with default TopPage (can be overridden using getLoginAssertions in tests)
        await use(getLoginAssertions('top-page'));
    },

    // Utility function for navigation and opening login popup
    openLoginPopupFromSource: async ({ page, topPage, fashionTypeDiagnosisPage, fashionTypeDiagnosisGuidePage }, use) => {
        // Define helper function to open login popup from the specified source
        const openLoginPopup = async (source: LoginPopupSource): Promise<void> => {
            // Check if page is still valid before proceeding
            if (page.isClosed()) {
                throw new Error('Cannot open login popup: Target page has been closed');
            }

            try {
                switch (source) {
                    case 'top-page':
                        await topPage.goto();
                        await page.waitForLoadState('networkidle');
                        await topPage.clickButton(TopPageButton.LOGIN_BUTTON);
                        break;

                    case 'fashion-diagnosis':
                        await fashionTypeDiagnosisPage.gotoFromUrl();
                        await page.waitForLoadState('networkidle');
                        await fashionTypeDiagnosisPage.clickButton(FashionTypeDiagnosisPageButton.LOGIN);
                        break;

                    case 'fashion-diagnosis-guide':
                        await fashionTypeDiagnosisGuidePage.gotoFromUrl();
                        await page.waitForLoadState('networkidle');
                        await fashionTypeDiagnosisGuidePage.clickButton(FashionTypeDiagnosisGuidePageButton.LOGIN);
                        break;

                    default:
                        throw new Error(`Unsupported login popup source: ${source}`);
                }
            } catch (error) {
                console.error(`Failed to open login popup from ${source}: ${error}`);
                throw error;
            }
        };

        await use(openLoginPopup);
    }
});

export { expect } from '@playwright/test';
