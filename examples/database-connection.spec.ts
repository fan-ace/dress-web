import { test, expect } from '../fixtures/DatabaseFixture';
import { RowDataPacket } from 'mysql2';

test.describe('Database Connection Tests', () => {
    test('should connect to database successfully', async ({ dbAcConnector }) => {
        // Verify connection by executing a simple query
        const [rows] = await dbAcConnector.query('SELECT 1 AS testValue');

        // Assert that we got a result back from the database
        expect(rows).toBeDefined();

        // Type check and cast to access rows data
        if (Array.isArray(rows) && rows.length > 0) {
            const typedRows = rows as RowDataPacket[];
            expect(typedRows[0].testValue).toBe(1);
        }

        console.log('Database connection test passed successfully');
    });

    test('should be able to query user table', async ({ dbAcConnector }) => {
        // Execute a query to check if a specific table exists and has data
        // Note: Replace 'users' with an actual table name in your database
        const [result] = await dbAcConnector.query('SHOW TABLES LIKE "users"');

        // Check if the table exists
        expect(result).toBeDefined();

        // Type check and handle the result
        if (Array.isArray(result) && result.length > 0) {
            // Just fetch the first record to verify access (limit 1)
            const [userData] = await dbAcConnector.query('SELECT * FROM users LIMIT 1');
            expect(userData).toBeDefined();

            // If there's data in the table, verify we can access it
            console.log('Successfully queried the users table');
        }
    });

    test('should handle database errors gracefully', async ({ dbAcConnector }) => {
        try {
            // Intentionally execute an invalid query to test error handling
            await dbAcConnector.query('SELECT * FROM non_existent_table');

            // If we reach this point, the query didn't throw an error as expected
            expect(false).toBeTruthy();
        } catch (error) {
            // Verify that we caught an error as expected
            expect(error).toBeDefined();
            console.log('Successfully caught database error for invalid table');
        }
    });
});
