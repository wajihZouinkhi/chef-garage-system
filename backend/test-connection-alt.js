// Test MongoDB connection with alternative settings
const mongoose = require('mongoose');
require('dotenv').config();

async function testAlternativeConnection() {
    // Try with different connection options
    const baseUri = process.env.MONGODB_URI.split('?')[0]; // Remove query params
    const alternativeUri = `${baseUri}?retryWrites=true&w=majority`;
    
    console.log('Testing alternative connection...');
    
    try {
        await mongoose.connect(alternativeUri, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            family: 4, // Force IPv4
        });
        
        console.log('✓ Alternative connection successful!');
        await mongoose.disconnect();
        
    } catch (error) {
        console.error('✗ Alternative connection failed:', error.message);
        
        // Try with Google DNS
        console.log('\nTrying to resolve DNS manually...');
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS
        
        try {
            const addresses = await new Promise((resolve, reject) => {
                dns.resolve4('cluster0.hrevluq.mongodb.net', (err, addresses) => {
                    if (err) reject(err);
                    else resolve(addresses);
                });
            });
            console.log('DNS resolved to:', addresses);
        } catch (dnsError) {
            console.error('DNS resolution failed:', dnsError.message);
        }
    }
}

testAlternativeConnection();