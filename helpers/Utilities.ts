/**
 * Utilities and helper functions for the test suite
 */

/**
 * Generate a random email for testing
 * @param domain - Optional domain name (default: example.com)
 * @returns string - A random email address
 */
export function generateRandomEmail(domain = 'example.com'): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `test_${randomString}_${timestamp}@${domain}`;
}

/**
 * Generate a random string of specified length
 * @param length - Length of the random string
 * @returns string - A random string
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

/**
 * Format a date object according to Japanese format
 * @param date - Date object to format
 * @returns string - Formatted date string
 */
export function formatJapaneseDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}年${month}月${day}日`;
}

/**
 * Create a timestamped file name with optional prefix and extension
 * @param prefix - Prefix for the file name
 * @param extension - File extension (without dot)
 * @returns string - Timestamped file name
 */
export function createTimestampedFileName(prefix: string, extension = 'txt'): string {
    const timestamp = new Date().toISOString()
        .replace(/:/g, '-')
        .replace(/\..+/, '')
        .replace('T', '_');

    return `${prefix}_${timestamp}.${extension}`;
}

/**
 * Sleep/wait for specified time
 * @param ms - Milliseconds to sleep
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if a string is a valid email format
 * @param email - Email string to validate
 * @returns boolean - True if valid email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Truncate a string to a certain length with optional ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param addEllipsis - Whether to add ellipsis at the end
 * @returns string - Truncated string
 */
export function truncateString(str: string, maxLength: number, addEllipsis = true): string {
    if (str.length <= maxLength) return str;

    return addEllipsis
        ? `${str.slice(0, maxLength)}...`
        : str.slice(0, maxLength);
}

/**
 * Parse boolean from environment variable or string
 * @param value - String value to parse
 * @returns boolean - Parsed boolean value
 */
export function parseBoolean(value: string | undefined): boolean {
    if (!value) return false;

    return ['true', '1', 'yes', 'y'].includes(value.toLowerCase());
}

/**
 * Get environment variable with fallback
 * @param name - Environment variable name
 * @param fallback - Fallback value if not set
 * @returns string - Environment variable value or fallback
 */
export function getEnv(name: string, fallback = ''): string {
    return process.env[name] || fallback;
}
