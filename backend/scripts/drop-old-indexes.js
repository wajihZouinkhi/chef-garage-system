// Script to drop old indexes from previous schema versions
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function dropOldIndexes() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/agro-care');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Collections to check
    const collections = ['vehicles', 'maintenancelogs'];
    
    for (const collectionName of collections) {
      console.log(`\nChecking collection: ${collectionName}`);
      
      try {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        
        console.log(`Current indexes in ${collectionName}:`, indexes.map(i => i.name));
        
        // Check if identifier index exists
        const hasIdentifierIndex = indexes.some(i => i.name === 'identifier_1');
        
        if (hasIdentifierIndex) {
          await collection.dropIndex('identifier_1');
          console.log(`✓ Dropped old "identifier_1" index from ${collectionName} collection`);
        } else {
          console.log(`✓ No "identifier_1" index found in ${collectionName}`);
        }
        
        // Also check for any other identifier-related indexes
        const identifierIndexes = indexes.filter(i => i.key && i.key.identifier);
        for (const idx of identifierIndexes) {
          if (idx.name !== 'identifier_1') { // Skip if already dropped
            await collection.dropIndex(idx.name);
            console.log(`✓ Dropped identifier-related index: ${idx.name} from ${collectionName}`);
          }
        }
        
      } catch (error) {
        if (error.code === 27) {
          console.log(`✓ Index does not exist in ${collectionName} - nothing to drop`);
        } else if (error.message.includes('ns not found')) {
          console.log(`✓ Collection ${collectionName} does not exist yet - skipping`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n✓ Database cleanup completed successfully!');
    console.log('\nYou can now restart your backend server.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

dropOldIndexes();
