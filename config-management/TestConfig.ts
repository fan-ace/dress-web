/**
 * Test configuration management
 * This class centralizes all configuration values used throughout the test suite
 */

import { getEnv, parseBoolean } from '../helpers/utilities';

/**
 * Configuration for timeouts, in milliseconds
 */
export const TimeoutConfig = {
    ELEMENT_TIMEOUT: parseInt(getEnv('ELEMENT_TIMEOUT', '5000')),
    PAGE_LOAD_TIMEOUT: parseInt(getEnv('PAGE_LOAD_TIMEOUT', '30000')),
    ANIMATION_TIMEOUT: parseInt(getEnv('ANIMATION_TIMEOUT', '500')),
    NETWORK_IDLE_TIMEOUT: parseInt(getEnv('NETWORK_IDLE_TIMEOUT', '10000')),
    API_TIMEOUT: parseInt(getEnv('API_TIMEOUT', '10000')),
};

/**
 * Configuration for URLs
 */
export const UrlConfig = {
    BASE_URL: getEnv('BASE_URL', 'https://aircloset.air-closet.com'),
    API_BASE_URL: getEnv('API_BASE_URL', 'https://api.air-closet.com'),
};

/**
 * Configuration for retries
 */
export const RetryConfig = {
    TEST_RETRIES: parseInt(getEnv('TEST_RETRIES', '2')),
    ACTION_RETRIES: parseInt(getEnv('ACTION_RETRIES', '3')),
};

/**
 * Configuration for test environment
 */
export const EnvironmentConfig = {
    IS_CI: parseBoolean(getEnv('CI')),
    ENV_NAME: getEnv('TEST_ENV', 'development'),
    HEADLESS: parseBoolean(getEnv('HEADLESS', 'false')),
    VIEWPORT_WIDTH: parseInt(getEnv('VIEWPORT_WIDTH', '1920')),
    VIEWPORT_HEIGHT: parseInt(getEnv('VIEWPORT_HEIGHT', '1080')),
    RECORD_VIDEO: parseBoolean(getEnv('RECORD_VIDEO', 'true')),
    TAKE_SCREENSHOTS: parseBoolean(getEnv('TAKE_SCREENSHOTS', 'true')),
};

/**
 * Configuration for browser-specific settings
 */
export const BrowserConfig = {
    DEFAULT_BROWSER: getEnv('DEFAULT_BROWSER', 'chromium'),
    USER_AGENT: getEnv('USER_AGENT', ''),
    LOCALE: getEnv('LOCALE', 'ja-JP'),
    TIMEZONE: getEnv('TIMEZONE', 'Asia/Tokyo'),
};

/**
 * Configuration for authentication
 */
export const AuthConfig = {
    AUTH_FILE_PATH: getEnv('AUTH_FILE_PATH', '/ac/auth.json'),
    USE_AUTH_FILE: parseBoolean(getEnv('USE_AUTH_FILE', 'true')),
};

/**
 * Constants for selectors and UI elements
 * Centralizing these values makes it easier to update when the UI changes
 */
export const UISelectors = {
    LOGIN_POPUP_TITLE: 'ログイン',
    LOGIN_EMAIL_INPUT: 'メールアドレス',
    LOGIN_PASSWORD_INPUT: 'パスワード',
    LOGIN_BUTTON: 'メールでログイン',
    LOGIN_TROUBLE_LINK: 'こちら',
    FORGOT_PASSWORD_LINK: 'パスワードをお忘れの方はこちら',
    REGISTER_LINK: '初めてのご利用ですか？無料会員登録はこちら',
    ERROR_INVALID_EMAIL: '不正なメールアドレスです。',
    ERROR_LOGIN_FAILED: 'Eメールアドレスが存在しないか、パスワードが誤っているためログインできません。',
};

/**
 * Main test configuration class that aggregates all config objects
 */
export class TestConfig {
    static readonly timeout = TimeoutConfig;
    static readonly url = UrlConfig;
    static readonly retry = RetryConfig;
    static readonly env = EnvironmentConfig;
    static readonly browser = BrowserConfig;
    static readonly auth = AuthConfig;
    static readonly ui = UISelectors;
}

export default TestConfig;
