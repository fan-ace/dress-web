# Allure Reporting for AirCloset Automation Framework

## Overview

This project uses Allure for advanced test reporting. Allure provides rich visuals and detailed test execution data to help identify issues quickly and understand test results better.

## Prerequisites

- Node.js (same version as project requirements)
- Java 8+ (required for Allure commandline tool)
- Project dependencies installed (`npm install`)

## Running Tests with Allure

### Basic Usage

```bash
# Run tests and generate Allure report
npm run allure:full

# Or run step by step:
npm run allure:clear      # Clear previous results
npm run test:allure       # Run tests with Allure reporting
npm run allure:generate   # Generate report from results
npm run allure:open       # Open report in browser
```

### Advanced Usage

```bash
# Run specific tests with Allure reporting
npx playwright test tests/examples/allure-example.spec.ts

# Generate report after manually running tests
npm run allure:report

# Preserve report history between runs
npm run allure:history
npm run allure:generate
```

## Report Features

The Allure report includes:

- **Dashboard**: Overview with test statistics
- **Categories**: Tests grouped by failure types
- **Suites**: Tests organized by test suites
- **Graphs**: Visual representations of test execution
- **Timeline**: Chronological view of test execution
- **Behaviors**: Tests organized by features/stories
- **Attachments**: Screenshots, HTML snippets, and other data captured during tests

## Working with the Allure Helper

Our custom Allure helper (`helpers/allure-helper.ts`) provides utility functions for:

- Adding screenshots to reports
- Creating structured test steps
- Attaching HTML content
- Adding JSON data
- Organizing tests by features and stories
- Setting test severity levels

Example usage:

```typescript
import { test, expect } from '../../helpers/allure-helper';
import { AllureHelper } from '../../helpers/allure-helper';

test('example test with allure', async ({ page }, testInfo) => {
  // Set test metadata
  AllureHelper.setFeature(testInfo, 'Login');
  AllureHelper.setSeverity(testInfo, 'critical');
  
  // Create a test step
  await AllureHelper.step(testInfo, 'Navigate to login page', async () => {
    await page.goto('https://aircloset.jp/login');
  });
  
  // Add a screenshot
  const screenshot = await page.screenshot();
  AllureHelper.addScreenshot(testInfo, 'Login page', screenshot);
  
  // Add JSON data
  AllureHelper.addJson(testInfo, 'Test data', { username: 'test@example.com' });
});
```

## Best Practices

1. **Always add metadata**: Use features, stories, and severity levels to organize tests
2. **Create meaningful steps**: Break tests into logical steps for better readability
3. **Add useful attachments**: Include screenshots at key points, HTML for structure analysis
4. **Track issues**: Use annotations to link failed tests to issue tracking
5. **Consistent naming**: Use clear naming for tests, steps, and attachments

## Troubleshooting

- If Allure fails to generate reports, ensure Java is installed correctly
- If report is missing data, check that the Allure reporter is properly configured in `playwright.config.ts`
- For blank/empty reports, check that tests are actually generating Allure results

## CI/CD Integration

The Allure reports can be integrated with CI/CD pipelines:

- **GitHub Actions**: Use the official Allure GitHub Actions
- **Jenkins**: Install the Allure Jenkins Plugin
- **GitLab CI**: Use Allure Docker Service

For detailed setup instructions, see the CI configuration files in the project repository.
