import { test as baseTest } from '@playwright/test';
import { DatabaseConnector } from '@helpers/DatabaseConnector';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Specify the path to the .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Define the data type for fixtures
type DatabaseFixtures = {
    dbAcConnector: DatabaseConnector;
};

// Extend test with dbAirclosetConnector fixture
export const test = baseTest.extend<DatabaseFixtures>({
    dbAcConnector: async ({ }, use) => {
        // Check if SSH_PRIVATE_KEY_PATH exists
        if (!process.env.SSH_PRIVATE_KEY_PATH) {
            throw new Error('SSH_PRIVATE_KEY_PATH is not defined in .env file');
        }

        // Verify private key path
        const keyPath = process.env.SSH_PRIVATE_KEY_PATH;
        console.log('SSH Key Path:', keyPath);

        // Check if path exists
        if (!fs.existsSync(keyPath)) {
            throw new Error(`SSH private key not found at path: ${keyPath}`);
        }

        // Check if path is a directory or file
        const stats = fs.statSync(keyPath);
        let privateKey;

        // If it's a file, read directly as string
        privateKey = fs.readFileSync(keyPath, 'utf8');

        const sshConfig = {
            host: process.env.SSH_HOST || '',
            port: Number(process.env.SSH_PORT || '22'),
            username: process.env.SSH_USERNAME || '',
            privateKey: privateKey,
        };

        const dbConfig = {
            host: process.env.DB_HOST!,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
        };

        const dbAirclosetConnector = new DatabaseConnector(sshConfig, dbConfig);
        await dbAirclosetConnector.connect();

        // Use dbAirclosetConnector in test
        await use(dbAirclosetConnector);

        // Close connection after test is complete
        await dbAirclosetConnector.close();
    },
});

export const expect = test.expect;
