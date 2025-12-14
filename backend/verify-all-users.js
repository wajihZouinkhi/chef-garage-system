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

async function verifyAllUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Verifying all users...');
    
    const result = await User.updateMany(
      { isEmailVerified: false },
      { 
        $set: { 
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users`);
    console.log('🎉 All users are now verified and can login!');

    // Show updated users
    const users = await User.find({}).select('username email isEmailVerified');
    console.log('\n📊 Updated user status:');
    users.forEach(user => {
      console.log(`   👤 ${user.username}: ${user.isEmailVerified ? '✅ VERIFIED' : '❌ NOT VERIFIED'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

verifyAllUsers();