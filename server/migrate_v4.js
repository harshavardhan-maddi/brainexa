import pool from './db.js';

const migrate = async () => {
  try {
    console.log('🚀 Starting fourth migration for Sub-Admins and Institutes...');

    // 1. Add institute and added_by columns to users table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS institute TEXT,
      ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES users(id) ON DELETE SET NULL;
    `);
    console.log('✅ Updated users table with institute and added_by columns');

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();
