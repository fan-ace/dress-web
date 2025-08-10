# Cookie Authentication for Playwright Tests

This project uses a cookie-based authentication method to bypass the LINE login flow in Playwright tests.

## How it works

Instead of logging in through the UI for each test, we:

1. Pre-define cookies from a successful login session
2. Store them in an `auth.json` file
3. Load these cookies for each test to establish an authenticated session

## Using the authentication

The authentication is automatically set up in the tests. When running tests with:

```
npx playwright test
```

The system will:
1. Create an auth.json file with the predefined cookies
2. Verify if those cookies are still valid
3. Use those cookies for all tests

## Updating expired cookies

Cookies expire after some time. When they do, you'll need to update them:

### Option 1: Use the built-in utility test

1. Open the test file and remove `.skip` from the "update cookies from browser export" test:

```typescript
// Change this:
test.skip('update cookies from browser export', async ({ page }) => {
// To this:
test('update cookies from browser export', async ({ page }) => {
```

2. Run just that test:

```bash
npx playwright test -g "update cookies from browser export"
```

3. A browser will open. Log in manually through the LINE authentication.
4. The test will save your authentication state to the auth.json file.
5. Remember to add the `.skip` back after updating.

### Option 2: Extract cookies manually from the browser

1. Log in to https://stg-disney.air-closet.com/ in Chrome or another browser
2. Open DevTools (F12) and go to the Application tab
3. Under Storage > Cookies, select the website
4. Extract the important cookies (stg-x-ac-user-id, stg-x-acd-refresh-token, etc.)
5. Update the cookies array in the test file

## Important cookies

The most important cookies for authentication are:
- stg-x-ac-user-id
- stg-x-acd-refresh-token
- stg-x-acd-session-token 
- stg-x-acd-access-key
- stg-x-acd-access-key-secret

These should be updated when they expire.

## Security note

The auth.json file contains sensitive tokens. It is recommended to:
- Add auth.json to your .gitignore
- Never commit authentication tokens to version control
- Regenerate tokens frequently
