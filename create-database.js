import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration without specifying database name
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'demo123',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function createDatabase() {
    console.log('🔍 Creating MySQL Database...\n');
    
    try {
        // Connect without specifying database
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected to MySQL server successfully!');

        // Create database if it doesn't exist
        await connection.execute('CREATE DATABASE IF NOT EXISTS tryon_studio');
        console.log('✅ Database "tryon_studio" created successfully!');

        // Use the database
        await connection.execute('USE tryon_studio');
        console.log('✅ Using database "tryon_studio"');

        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE,
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table "users" created successfully!');

        // Create try_on_results table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS try_on_results (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36) NOT NULL,
                person_image_url TEXT NOT NULL,
                clothing_image_url TEXT NOT NULL,
                result_image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Table "try_on_results" created successfully!');

        // Create indexes
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_try_on_results_user_id ON try_on_results(user_id)
        `);
        
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_try_on_results_created_at ON try_on_results(created_at)
        `);
        
        await connection.execute(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
        `);
        console.log('✅ Indexes created successfully!');

        await connection.end();
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n🔗 You can now connect to MySQL Workbench with:');
        console.log('   Host: localhost');
        console.log('   Port: 3306');
        console.log('   Database: tryon_studio');
        console.log('   Username: root');
        console.log('   Password: demo123');
        
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        console.log('\nPlease make sure:');
        console.log('1. MySQL server is running');
        console.log('2. User "root" with password "demo123" has access');
        console.log('3. MySQL server is accessible on localhost:3306');
    }
}

createDatabase(); 