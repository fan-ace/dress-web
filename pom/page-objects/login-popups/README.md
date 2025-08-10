# Login Popup Architecture

## Overview

The login popup appears on multiple pages within the application (TopPage, FashionTypeDiagnosis page, FashionTypeDiagnosisGuide page), but the locators for its elements can vary between pages. This architecture provides a maintainable and extensible solution for this situation.

## Key Components

1. **BaseLoginPopup**: An abstract base class that defines the common interface and functionality
2. **Page-specific implementations**: Concrete implementations for each page context
   - TopPageLoginPopup
   - FashionTypeDiagnosisLoginPopup
   - FashionTypeDiagnosisGuideLoginPopup
3. **LoginPopupFactory**: A factory class that creates the appropriate implementation
4. **LoginPopup**: A facade class that delegates to the appropriate implementation

## How It Works

1. The `LoginPopup` facade class is the main entry point for tests and other code
2. It delegates all method calls to the appropriate implementation
3. The implementation is selected based on the current page context
4. This allows tests to use the same interface regardless of which page the popup appears on

## Using LoginPopup in Tests

### Basic Usage

```typescript
// Create a LoginPopup instance with explicit context
const loginPopup = new LoginPopup(page, LoginPopupContext.TOP_PAGE);

// Use the LoginPopup as usual
await loginPopup.enterEmail('test@example.com');
await loginPopup.enterPassword('password');
await loginPopup.clickLoginWithEmail();
```

### Auto-detecting Context

```typescript
// Create a LoginPopup instance without specifying context
const loginPopup = new LoginPopup(page);

// Update the implementation based on the current page
await loginPopup.updateImplementationFromCurrentPage();

// Use the LoginPopup as usual
await loginPopup.enterEmail('test@example.com');
await loginPopup.enterPassword('password');
await loginPopup.clickLoginWithEmail();
```

### Using in Page Objects

```typescript
export class SomePage extends BasePage {
    private readonly loginButton: Locator;
    private loginPopup: LoginPopup;

    constructor(page: Page) {
        super(page);
        this.loginButton = this.page.getByRole('button', { name: 'ログイン' });
        this.loginPopup = new LoginPopup(page, LoginPopupContext.SOME_PAGE);
    }

    async openLoginPopup(): Promise<void> {
        await this.loginButton.click();
        await this.loginPopup.isDisplayed();
    }

    async login(email: string, password: string): Promise<void> {
        await this.openLoginPopup();
        await this.loginPopup.enterEmail(email);
        await this.loginPopup.enterPassword(password);
        await this.loginPopup.clickLoginWithEmail();
    }
}
```

## Extending for New Pages

To add support for a new page:

1. Create a new class that extends `BaseLoginPopup`
2. Implement the page-specific locators
3. Add the new page context to the `LoginPopupContext` enum
4. Update the `LoginPopupFactory` to create the new implementation

Example:

```typescript
// 1. Create new implementation
export class NewPageLoginPopup extends BaseLoginPopup {
    // Implement all abstract properties with page-specific locators
}

// 2. Add to context enum
export enum LoginPopupContext {
    // Existing contexts...
    NEW_PAGE = 'new-page',
}

// 3. Update factory
static create(page: Page, context: LoginPopupContext): BaseLoginPopup {
    switch (context) {
        // Existing cases...
        case LoginPopupContext.NEW_PAGE:
            return new NewPageLoginPopup(page);
        default:
            // Default to TopPage implementation if context is unknown
            return new TopPageLoginPopup(page);
    }
}
```
