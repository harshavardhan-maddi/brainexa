import pool from './db.js';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  const email = '25475A4603';
  const password = '25475A4603';
  const name = 'System Administrator';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update old admin email to new ID if it exists
    await pool.query('UPDATE users SET email = $1 WHERE email = $2', [email, 'admin@brainexa.com']);

    // Check if exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4',
        [hashedPassword, 'admin', name, email]
      );
      console.log('✅ Admin user updated');
    } else {
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [name, email, hashedPassword, 'admin']
      );
      console.log('✅ Admin user created');
    }

    console.log('\n--- Admin Credentials ---');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAdmin();
