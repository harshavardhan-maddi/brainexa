import pool from './db.js';
import bcrypt from 'bcryptjs';

const initDB = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT,
        role TEXT DEFAULT 'student',
        is_blocked BOOLEAN DEFAULT FALSE,
        plan TEXT DEFAULT 'free',
        profile_picture TEXT,
        reset_token TEXT,
        token_expiry TIMESTAMP,
        institute TEXT,
        added_by UUID REFERENCES users(id) ON DELETE SET NULL,
        syllabus_update_allowance INTEGER DEFAULT 5,
        rules_accepted BOOLEAN DEFAULT FALSE,
        study_start_date TEXT,
        study_end_date TEXT,
        syllabus_update_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Subjects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        current_topic_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Topics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        questions_attempted INTEGER DEFAULT 0,
        questions_correct INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Study Plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS study_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        day INTEGER NOT NULL,
        tasks JSONB NOT NULL,
        date TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Quiz Results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        weak_topics JSONB,
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Progress table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS progress (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        study_progress INTEGER DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Chat History table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Temporary OTPs table for signup
    await pool.query(`
      CREATE TABLE IF NOT EXISTS temp_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        otp TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Payments Tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        amount NUMERIC NOT NULL,
        method TEXT NOT NULL,
        transaction_id TEXT,
        status TEXT DEFAULT 'success',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Unified Learning Materials table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_materials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        subject TEXT,
        type TEXT NOT NULL, -- 'generated' or 'uploaded'
        format TEXT NOT NULL, -- 'pdf' or 'notes'
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Knowledge Logs (Module 1 - Search + Retrieval)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS knowledge_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        topic_name TEXT NOT NULL,
        search_query TEXT,
        links JSONB,
        content TEXT,
        opened_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Learning Sessions (Module 5 - Active Learning)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        topic_name TEXT NOT NULL,
        explanation TEXT,
        questions JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Topic Progress (Module 7 - Progress Tracking)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS topic_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        topic_name TEXT NOT NULL UNIQUE,
        score INTEGER,
        attempts INTEGER DEFAULT 1,
        status TEXT, -- 'Completed', 'Needs Revision', 'Weak'
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Email Change History (rate-limit + reuse prevention)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_change_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        old_email TEXT NOT NULL,
        new_email TEXT NOT NULL,
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Activity Logs
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action TEXT,
        metadata JSONB,
        type TEXT,
        subject TEXT,
        description TEXT,
        score INTEGER,
        total INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Run database migrations/alterations to support all feature updates on existing tables
    console.log('⚙️ Running database migrations...');
    
    // 1. Alter Users
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP,
      ADD COLUMN IF NOT EXISTS institute TEXT,
      ADD COLUMN IF NOT EXISTS added_by UUID REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS syllabus_update_allowance INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS rules_accepted BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS study_start_date TEXT,
      ADD COLUMN IF NOT EXISTS study_end_date TEXT,
      ADD COLUMN IF NOT EXISTS syllabus_update_count INTEGER DEFAULT 0;
    `);
    console.log('✅ Users table migrations verified');

    // 2. Alter Study Plans
    await pool.query(`
      ALTER TABLE study_plans 
      ADD COLUMN IF NOT EXISTS date TEXT;
    `);
    console.log('✅ Study plans table migrations verified');

    // 3. Alter Knowledge Logs
    await pool.query(`
      ALTER TABLE knowledge_logs 
      ADD COLUMN IF NOT EXISTS opened_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✅ Knowledge logs table migrations verified');

    // 4. Alter Activity Logs
    await pool.query(`
      ALTER TABLE activity_logs 
      ADD COLUMN IF NOT EXISTS type TEXT,
      ADD COLUMN IF NOT EXISTS subject TEXT,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS score INTEGER,
      ADD COLUMN IF NOT EXISTS total INTEGER,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS action TEXT,
      ADD COLUMN IF NOT EXISTS metadata JSONB,
      ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    `);

    // Ensure nullable activity log columns
    await pool.query(`
      ALTER TABLE activity_logs 
      ALTER COLUMN type DROP NOT NULL,
      ALTER COLUMN action DROP NOT NULL;
    `);
    console.log('✅ Activity logs table migrations verified');

    // 5. Seed default admin if needed or update their password/role
    console.log('👤 Seeding default admin...');
    const adminEmail = 'admin@brainexa.com';
    const adminPassword = 'Brainexa@admin';
    const adminName = 'System Administrator';
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (existingAdmin.rows.length > 0) {
      await pool.query(
        'UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4',
        [hashedAdminPassword, 'admin', adminName, adminEmail]
      );
      console.log('✅ Admin user updated in database');
    } else {
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [adminName, adminEmail, hashedAdminPassword, 'admin']
      );
      console.log('✅ Admin user created in database');
    }

    console.log('✅ Database tables initialized and migrated successfully');
  } catch (error) {
    console.error('❌ Error initializing database/migrations:', error);
    // Note: Don't exit process here if we want the server to try to run anyway
  }
};

export default initDB;

