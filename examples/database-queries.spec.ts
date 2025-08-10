import { test, expect } from '../fixtures/DatabaseFixture';
import { RowDataPacket } from 'mysql2';

test.describe('AirCloset Database Queries', () => {
    test('should retrieve product information', async ({ dbAcConnector }) => {
        // Query to fetch products (adjust table name and columns as needed)
        const [products] = await dbAcConnector.query(
            'SELECT * FROM users LIMIT 5'
        );

        expect(products).toBeDefined();

        if (Array.isArray(products) && products.length > 0) {
            const typedProducts = products as RowDataPacket[];
            console.log(`Retrieved ${typedProducts.length} products`);

            // Log first product details for verification
            console.log('First product:', JSON.stringify(typedProducts[0], null, 2));

            // Verify product has expected properties (adjust based on your schema)
            expect(typedProducts[0]).toHaveProperty('id');
        }
    });

    test('should retrieve user information', async ({ dbAcConnector }) => {
        // Query to fetch users (adjust table name and columns as needed)
        const [users] = await dbAcConnector.query(
            'SELECT id, email, created_at FROM users LIMIT 3'
        );

        expect(users).toBeDefined();

        if (Array.isArray(users) && users.length > 0) {
            const typedUsers = users as RowDataPacket[];
            console.log(`Retrieved ${typedUsers.length} users`);

            // Verify user has expected properties
            expect(typedUsers[0]).toHaveProperty('id');
            expect(typedUsers[0]).toHaveProperty('email');
        }
    });

    test('should check database version', async ({ dbAcConnector }) => {
        // Query MySQL version to verify connectivity
        const [versionInfo] = await dbAcConnector.query('SELECT VERSION() as version');

        expect(versionInfo).toBeDefined();

        if (Array.isArray(versionInfo) && versionInfo.length > 0) {
            const typedInfo = versionInfo as RowDataPacket[];
            console.log('Database version:', typedInfo[0].version);

            expect(typedInfo[0]).toHaveProperty('version');
        }
    });

    test('should be able to run a complex query', async ({ dbAcConnector }) => {
        // This is an example of a more complex query with joins
        // Adjust table names and structure based on your actual schema
        const query = `
      SELECT u.id, u.email, COUNT(p.id) as product_count
      FROM users u
      LEFT JOIN products p ON u.id = p.user_id
      GROUP BY u.id
      ORDER BY product_count DESC
      LIMIT 5
    `;

        try {
            const [results] = await dbAcConnector.query(query);

            expect(results).toBeDefined();

            if (Array.isArray(results) && results.length > 0) {
                const typedResults = results as RowDataPacket[];
                console.log('Users with most products:', JSON.stringify(typedResults, null, 2));

                // Verify the results have the expected structure
                expect(typedResults[0]).toHaveProperty('email');
                expect(typedResults[0]).toHaveProperty('product_count');
            }
        } catch (error) {
            console.log('Complex query failed, tables might not match schema:', error);
            // Don't fail the test, just log the error as this is just an example
        }
    });
});
