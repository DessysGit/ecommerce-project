const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    try {
        console.log('Setting up the database...');

        // Read SQL file
        const sql = fs.readFileSync('./database.sql', 'utf8');

        // Execute SQL commands
        await pool.query(sql);

        console.log('Database tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase();