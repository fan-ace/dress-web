# Authentication Troubleshooting Guide

## Error: "Error reading storage state from auth.json"

If you're seeing this error:
```
Error: Error reading storage state from auth.json:
    ENOENT: no such file or directory, open 'auth.json'
```

This happens because the tests are configured to use authentication stored in the `auth.json` file, but this file doesn't exist yet.

## Solution:

### Option 1: Use the setup script (Recommended)

Run the authentication setup script to generate the `auth.json` file:

```bash
cd /path/to/your/project/ac
./setup-auth.sh
```

This script will:
1. Run the authentication setup test
2. Generate the `auth.json` file with valid authentication cookies
3. Allow you to run tests without authentication errors

### Option 2: Manually update the configuration

If you prefer to run tests without authentication:

1. Open `playwright.config.ts`
2. Comment out or remove the `storageState: 'auth.json'` line
3. Run your tests normally

### Option 3: Manually run the auth setup

```bash
npx playwright test fixtures/auth/auth.setup.ts --project=chromium
```

## Additional Information

- Authentication cookies expire after some time and will need to be refreshed
- See AUTH-README.md for more details on the authentication process
