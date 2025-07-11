import { testConnection, initializeDatabase } from './backend/database.js';

async function testDatabase() {
    console.log('🔍 Testing MySQL Database Connection...\n');
    
    try {
        // Test connection
        const connected = await testConnection();
        if (!connected) {
            console.log('❌ Database connection failed!');
            console.log('Please make sure:');
            console.log('1. MySQL server is running');
            console.log('2. Database "tryon_studio" exists');
            console.log('3. User "root" with password "demo123" has access');
            return;
        }

        // Initialize tables
        console.log('📋 Initializing database tables...');
        const initialized = await initializeDatabase();
        if (initialized) {
            console.log('✅ Database setup completed successfully!');
            console.log('\n📊 Tables created:');
            console.log('   - users');
            console.log('   - try_on_results');
            console.log('\n🔗 You can now connect to MySQL Workbench with:');
            console.log('   Host: localhost');
            console.log('   Port: 3306');
            console.log('   Database: tryon_studio');
            console.log('   Username: root');
            console.log('   Password: demo123');
        } else {
            console.log('❌ Database initialization failed!');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDatabase(); 