// Migration script to add is_admin field to users table
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addAdminField() {
  try {
    console.log('🔧 Adding is_admin field to users table...');
    
    // Add is_admin column if it doesn't exist
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE
    `);
    
    console.log('✅ Added is_admin column');
    
    // Set user with id=1 (admin@demo.com) as admin
    const result = await pool.query(`
      UPDATE users 
      SET is_admin = TRUE 
      WHERE id = 1
      RETURNING id, email, first_name, is_admin
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Set admin privileges for:');
      console.log(`   User ID: ${result.rows[0].id}`);
      console.log(`   Email: ${result.rows[0].email}`);
      console.log(`   Name: ${result.rows[0].first_name}`);
      console.log(`   Is Admin: ${result.rows[0].is_admin}`);
    } else {
      console.log('⚠️  User with ID=1 not found. Please create an admin account first.');
    }
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

addAdminField();
