// Quick fix for identifier index issue
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixIdentifierIndex() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to MongoDB...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 10000, // 10 second connection timeout
  });
  
  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('vehicles');
    
    // List current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => ({ name: i.name, key: i.key })));
    
    // Check for identifier index
    const identifierIndex = indexes.find(i => i.name === 'identifier_1');
    
    if (identifierIndex) {
      console.log('Found identifier_1 index, dropping it...');
      await collection.dropIndex('identifier_1');
      console.log('✓ Successfully dropped identifier_1 index');
    } else {
      console.log('No identifier_1 index found');
    }
    
    // List indexes after cleanup
    const newIndexes = await collection.indexes();
    console.log('Indexes after cleanup:', newIndexes.map(i => ({ name: i.name, key: i.key })));
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message.includes('ETIMEOUT')) {
      console.log('\nNetwork timeout. Try these alternatives:');
      console.log('1. Check your internet connection');
      console.log('2. Use MongoDB Compass to connect and drop the index manually');
      console.log('3. Use the MongoDB Atlas web interface');
    }
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

fixIdentifierIndex();