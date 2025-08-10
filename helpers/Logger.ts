/**
 * Custom logger for test execution
 * Provides consistent logging across the test suite with different log levels
 */

import { createTimestampedFileName } from './Utilities';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Log levels enum
 */
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
}

/**
 * Logger configuration interface
 */
interface LoggerConfig {
    logToConsole: boolean;
    logToFile: boolean;
    logLevel: LogLevel;
    logFilePath?: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
    logToConsole: true,
    logToFile: false,
    logLevel: LogLevel.INFO
};

/**
 * Logger class for centralized logging
 */
export class Logger {
    private config: LoggerConfig;
    private logFile?: string;

    /**
     * Creates a new Logger instance
     * @param name - Name of the logger (typically the class or component name)
     * @param config - Logger configuration
     */
    constructor(
        private name: string,
        config: Partial<LoggerConfig> = {}
    ) {
        // Merge default config with provided config
        this.config = { ...defaultConfig, ...config };

        // Set up log file if enabled
        if (this.config.logToFile) {
            const logDir = path.resolve(process.cwd(), 'logs');

            // Create logs directory if it doesn't exist
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            // Create log file path
            this.logFile = path.join(
                logDir,
                this.config.logFilePath || createTimestampedFileName('test-run', 'log')
            );
        }
    }

    /**
     * Internal log method
     * @param level - Log level
     * @param message - Log message
     * @param data - Optional data to log
     */
    private log(level: LogLevel, message: string, data?: any): void {
        // Skip if log level is lower than configured level
        if (this.shouldSkipLog(level)) {
            return;
        }

        // Format log message
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level}] [${this.name}] ${message}`;

        // Log to console if enabled
        if (this.config.logToConsole) {
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(formattedMessage);
                    break;
                case LogLevel.INFO:
                    console.info(formattedMessage);
                    break;
                case LogLevel.WARN:
                    console.warn(formattedMessage);
                    break;
                case LogLevel.ERROR:
                case LogLevel.FATAL:
                    console.error(formattedMessage);
                    break;
            }

            // Log data if provided
            if (data !== undefined) {
                try {
                    console.log(JSON.stringify(data, null, 2));
                } catch (error) {
                    console.log(data);
                }
            }
        }

        // Log to file if enabled
        if (this.config.logToFile && this.logFile) {
            let logEntry = formattedMessage;

            // Add data if provided
            if (data !== undefined) {
                try {
                    logEntry += `\n${JSON.stringify(data, null, 2)}`;
                } catch (error) {
                    logEntry += `\n${data}`;
                }
            }

            // Append to log file
            fs.appendFileSync(this.logFile, `${logEntry}\n`);
        }
    }

    /**
     * Check if log should be skipped based on log level
     * @param level - Log level to check
     * @returns boolean - True if log should be skipped
     */
    private shouldSkipLog(level: LogLevel): boolean {
        const logLevels = {
            [LogLevel.DEBUG]: 0,
            [LogLevel.INFO]: 1,
            [LogLevel.WARN]: 2,
            [LogLevel.ERROR]: 3,
            [LogLevel.FATAL]: 4
        };

        return logLevels[level] < logLevels[this.config.logLevel];
    }

    /**
     * Log a debug message
     * @param message - Log message
     * @param data - Optional data to log
     */
    debug(message: string, data?: any): void {
        this.log(LogLevel.DEBUG, message, data);
    }

    /**
     * Log an info message
     * @param message - Log message
     * @param data - Optional data to log
     */
    info(message: string, data?: any): void {
        this.log(LogLevel.INFO, message, data);
    }

    /**
     * Log a warning message
     * @param message - Log message
     * @param data - Optional data to log
     */
    warn(message: string, data?: any): void {
        this.log(LogLevel.WARN, message, data);
    }

    /**
     * Log an error message
     * @param message - Log message
     * @param error - Optional error to log
     */
    error(message: string, error?: any): void {
        this.log(LogLevel.ERROR, message, error);
    }

    /**
     * Log a fatal message
     * @param message - Log message
     * @param error - Optional error to log
     */
    fatal(message: string, error?: any): void {
        this.log(LogLevel.FATAL, message, error);
    }
}
