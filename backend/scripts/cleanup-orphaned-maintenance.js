require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;

async function cleanupOrphanedMaintenance() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const maintenanceCollection = db.collection('maintenancelogs');
    const vehiclesCollection = db.collection('vehicles');

    // Get all vehicle IDs
    const vehicles = await vehiclesCollection.find({}, { _id: 1 }).toArray();
    const vehicleIds = vehicles.map(v => v._id.toString());

    console.log(`Found ${vehicleIds.length} vehicles`);

    // Find maintenance records with non-existent vehicle IDs
    const allMaintenance = await maintenanceCollection.find({}).toArray();
    const orphanedRecords = allMaintenance.filter(m => {
      const vehicleIdStr = m.vehicleId ? m.vehicleId.toString() : null;
      return vehicleIdStr && !vehicleIds.includes(vehicleIdStr);
    });

    console.log(`Found ${orphanedRecords.length} orphaned maintenance records`);

    if (orphanedRecords.length > 0) {
      const orphanedIds = orphanedRecords.map(r => r._id);
      const result = await maintenanceCollection.deleteMany({ _id: { $in: orphanedIds } });
      console.log(`Deleted ${result.deletedCount} orphaned maintenance records`);
    } else {
      console.log('No orphaned records to delete');
    }

    await mongoose.connection.close();
    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupOrphanedMaintenance();
