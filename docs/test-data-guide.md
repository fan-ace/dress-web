# Test Data Usage Guide

## Overview

This guide explains how to use and maintain test data in the Aircloset automation project. Properly organized test data improves maintainability, reusability, and makes tests more robust.

## Test Data Organization

Test data is organized in the `test-data` directory with separate files for different types of data:

- `email-validation-data.ts`: Contains email validation test data
- (Add more data files as needed)

## Using Test Data in Tests

### 1. Importing Test Data

```typescript
import { invalidEmails, validEmails, loginCredentials } from "../../test-data/email-validation-data";
```

### 2. Using Test Data with Data-Driven Tests

```typescript
// Iterate through test data for comprehensive testing
for (const email of invalidEmails) {
  test(`Invalid email input shows error: ${email}`, async ({ page }) => {
    // Test implementation using the email value
  });
}
```

### 3. Using Specific Test Data

```typescript
// Use specific test data directly
await loginPage.enterEmail(loginCredentials.invalidUser.email);
await loginPage.enterPassword(loginCredentials.invalidUser.password);
```

### 4. Selecting a Subset of Test Data

```typescript
// Use just a portion of the test data when needed
const sampleEmails = invalidEmails.slice(0, 3); // First 3 invalid emails
```

## Benefits of Centralized Test Data

1. **Maintainability**: Update test data in one place
2. **Consistency**: Use the same test data across different tests
3. **Documentation**: Test data is well-documented and organized
4. **Reusability**: Easily reuse data across different test scenarios

## Best Practices

1. Keep test data in separate files organized by domain/function
2. Document the purpose of each test data set with comments
3. Use meaningful variable names
4. Consider environment-specific test data when needed
5. Avoid hardcoding test data in test files

## Adding New Test Data

To add new test data:

1. Identify the appropriate test data file (or create a new one if needed)
2. Add well-documented data with appropriate typing
3. Export the data for use in tests
4. Import and use the data in your test files
