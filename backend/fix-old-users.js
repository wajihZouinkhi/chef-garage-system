const mongoose = require('mongoose');
require('dotenv').config();

// User schema (simplified)
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: String,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function fixOldUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Fixing old users without email fields...');
    
    // Update users that don't have email field or isEmailVerified field
    const result = await User.updateMany(
      { 
        $or: [
          { email: { $exists: false } },
          { email: null },
          { email: undefined },
          { isEmailVerified: { $exists: false } },
          { isEmailVerified: null }
        ]
      },
      { 
        $set: { 
          email: 'admin@lajoiedechicha.com', // Set a default email
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} old users`);

    // Show all users now
    const users = await User.find({}).select('username email isEmailVerified role');
    console.log('\n📊 All users status:');
    users.forEach(user => {
      console.log(`   👤 ${user.username} (${user.role}): ${user.isEmailVerified ? '✅ VERIFIED' : '❌ NOT VERIFIED'} - ${user.email}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

fixOldUsers();