/**
 * Test data for email validation scenarios
 */

/**
 * Collection of invalid email formats for testing email validation
 * Each email format should trigger the email validation error in the application.
 * Note: Some technically invalid emails (by RFC822 standards) are accepted by the application.
 */
export const invalidEmails = [
    'userexample.com',          // Missing @ symbol
    'username@',                // Missing domain
    '@domain.com',              // Missing username
    'user name@domain.com',     // Contains space
    'user<>name@domain.com',    // Contains invalid characters
    'user@domain',              // Missing top-level domain
    'user@.com',                // Missing domain name
    'user@domain..com',         // Consecutive dots in domain
    // The following formats are accepted by the application even though they are technically invalid
    // 'user@-domain.com',      // Domain starts with hyphen
    // 'user@domain-.com',      // Domain ends with hyphen
    // '.user@domain.com',      // Username starts with dot
];

/**
 * Collection of valid email formats for positive testing
 */
export const validEmails = [
    'user@example.com',
    'user.name@example.com',
    'user-name@example.com',
    'user_name@example.com',
    'user+name@example.com',
    'user123@example.com',
    'user@example.co.jp',
    'user@subdomain.example.com',
];

/**
 * Login credentials for testing authentication
 */
export const loginCredentials = {
    invalidUser: {
        email: 'abcfgh@air-closet.com',
        password: 'Ab1234567'
    },
    validUser: {
        // Add valid user credentials here when needed for testing
        // Should be stored securely, preferably in environment variables
    }
};
