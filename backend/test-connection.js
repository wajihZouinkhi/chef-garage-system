// Test MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            connectTimeoutMS: 10000,
        });
        
        console.log('✓ Successfully connected to MongoDB!');
        
        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✓ Connection closed');
        
    } catch (error) {
        console.error('✗ Connection failed:', error.message);
        
        if (error.message.includes('ETIMEOUT')) {
            console.log('\nPossible solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Verify your IP is whitelisted in MongoDB Atlas');
            console.log('3. Try connecting from a different network');
            console.log('4. Check if your firewall is blocking the connection');
        }
        
        if (error.message.includes('authentication failed')) {
            console.log('\nAuthentication issue - check your username/password');
        }
    }
}

testConnection();