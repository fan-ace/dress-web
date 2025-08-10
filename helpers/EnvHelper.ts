import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper class to load and access environment variables from .env files
 * Follows the Page Object Model design pattern of the framework
 */
export class EnvHelper {
    private static instance: EnvHelper;
    private envConfig: Record<string, string | undefined> = {};

    /**
     * Private constructor to enforce singleton pattern
     * @param envPath Optional path to the .env file
     */
    private constructor(envPath?: string) {
        // Load environment variables from .env file
        const result = dotenv.config({
            path: envPath || path.resolve(process.cwd(), '.env')
        });

        if (result.error) {
            console.warn(`Warning: .env file not found or has errors. Using process.env variables only.`);
        }

        // Merge .env file variables with process.env
        this.envConfig = {
            ...process.env,
            ...result.parsed || {}
        };
    }

    /**
     * Get the singleton instance of EnvHelper
     * @param envPath Optional path to the .env file
     * @returns EnvHelper instance
     */
    public static getInstance(envPath?: string): EnvHelper {
        if (!EnvHelper.instance) {
            EnvHelper.instance = new EnvHelper(envPath);
        }
        return EnvHelper.instance;
    }

    /**
     * Get an environment variable value
     * @param key The environment variable key
     * @param defaultValue Optional default value if the key doesn't exist
     * @returns The value of the environment variable or the default value
     */
    public get(key: string, defaultValue?: string): string {
        return this.envConfig[key] || defaultValue || '';
    }

    /**
     * Get an environment variable as a number
     * @param key The environment variable key
     * @param defaultValue Optional default value if the key doesn't exist or can't be parsed
     * @returns The numeric value of the environment variable or the default value
     */
    public getNumber(key: string, defaultValue?: number): number {
        const value = this.get(key);
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? (defaultValue || 0) : parsed;
    }

    /**
     * Get an environment variable as a boolean
     * @param key The environment variable key
     * @param defaultValue Optional default value if the key doesn't exist
     * @returns The boolean value of the environment variable or the default value
     */
    public getBoolean(key: string, defaultValue?: boolean): boolean {
        const value = this.get(key).toLowerCase();
        if (value === 'true' || value === '1' || value === 'yes') return true;
        if (value === 'false' || value === '0' || value === 'no') return false;
        return defaultValue !== undefined ? defaultValue : false;
    }

    /**
     * Check if an environment variable exists
     * @param key The environment variable key
     * @returns True if the environment variable exists, false otherwise
     */
    public has(key: string): boolean {
        return key in this.envConfig;
    }

    /**
     * Get all environment variables as an object
     * @returns All environment variables
     */
    public getAll(): Record<string, string | undefined> {
        return { ...this.envConfig };
    }

    /**
     * Load environment variables from a specific environment file
     * @param environment The environment name (e.g., 'dev', 'stage', 'prod')
     */
    public loadEnvironment(environment: string): void {
        const envFilePath = path.resolve(process.cwd(), `.env.${environment}`);

        if (fs.existsSync(envFilePath)) {
            const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
            this.envConfig = {
                ...this.envConfig,
                ...envConfig as Record<string, string | undefined>
            };
        } else {
            console.warn(`Environment file .env.${environment} not found.`);
        }
    }
}

// Export default instance for easy import
export default EnvHelper.getInstance();
