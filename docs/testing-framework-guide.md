# AirCloset Automation Testing Framework Guide

## Project Structure

```
├── pom/                      # Page Object Model
│   ├── page-objects/         # Page classes representing application screens
│   ├── assertions/           # Assertion helpers for validating UI states
│   ├── common/               # Shared utilities and base classes
│   └── components/           # Reusable UI components
├── fixtures/                 # Test fixtures for setting up test contexts
├── tests/                    # Test specifications organized by feature areas
│   ├── aircloset/            # Tests for specific AirCloset features
│   └── examples/             # Example tests and templates
├── api-client/               # API client classes
├── helpers/                  # Helper functions and utilities
├── test-data/                # Test data resources
├── docs/                     # Documentation
├── config-management/        # Configuration management
└── playwright.config.ts      # Playwright configuration
```

## Core Design Patterns

### 1. Page Object Model (POM)
- **Principle**: Separate UI logic from test logic
- **Organization**:
  - Base classes in `/pom/common/`
  - Page implementations in `/pom/page-objects/`
  - Reusable components in `/pom/components/`

### 2. Factory Pattern & Strategy Pattern
- **Implementation**: Login popup across multiple pages with different DOM structures
- **Components**:
  - `BaseLoginPopup`: Abstract base class defining the interface
  - Page-specific implementations: `TopPageLoginPopup`, `FashionTypeDiagnosisLoginPopup`
  - `LoginPopupFactory`: Creates appropriate implementation for page context
  - `LoginPopup`: Facade class that delegates to the right implementation

```typescript
// Using the LoginPopup facade
const loginPopup = topPage.loginPopup;
await loginPopup.enterEmail('user@example.com');
```

### 3. Fixture Pattern
- **Principle**: Reusable test setup and teardown
- **Benefits**:
  - Standardized test environment
  - Pre-configured page objects
  - Helper functions for common workflows

```typescript
// Using fixtures for login popup testing
test('verify login popup on TopPage', async ({ 
  topPage, openLoginPopupFromSource 
}) => {
  await openLoginPopupFromSource('top-page');
  // Test logic here
});
```

## Authentication System

- **Cookie-based authentication**: Bypasses LINE login flow
- **Storage**: Stored in `auth.json` at project root
- **Usage**: Applied via Playwright's `storageState`
- **Maintenance**: Update expired cookies with the utility test in authentication file

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test files
npx playwright test tests/aircloset/login-popup-cross-page.spec.ts

# Run with specific browser
npx playwright test --project=chromium
```

## Debugging

```bash
# Run with UI mode for debugging
npx playwright test --ui

# Run with debug mode
npx playwright test --debug
```

## Reporting

- **HTML reports**: Generated in `/playwright-report/`
- **Allure reports**: Generated in `/allure-report/`

```bash
npx allure serve allure-results
```

## Best Practices

1. **Separate assertions**: Create dedicated assertion classes for complex components
2. **Keep POM pure**: Page objects should only contain selectors and actions, not assertions
3. **Use fixtures**: Leverage fixtures for common test setup and workflows
4. **Group assertions**: Provide methods to run related assertion groups
5. **Extend base classes**: Inherit from base classes to utilize common methods

## Process for Adding New Login Popup Support

1. Create implementation extending `BaseLoginPopup`
2. Add new context to `LoginPopupContext` enum
3. Update `LoginPopupFactory` to support the new context
4. Create any necessary fixtures or assertions

## Related Documentation

- [Authentication Troubleshooting Guide](../AUTH-TROUBLESHOOTING.md)
- [Disney Login Guide](../DISNEY-LOGIN-GUIDE.md)
- [Playwright Official Documentation](https://playwright.dev/docs/intro)
