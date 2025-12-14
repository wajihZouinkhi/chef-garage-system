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

async function checkUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Checking users in database...');
    const users = await User.find({}).select('-password');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      console.log('\n' + '='.repeat(80));
      
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Email Verified: ${user.isEmailVerified ? '✅ YES' : '❌ NO'}`);
        console.log(`   Has Verification Token: ${user.emailVerificationToken ? '✅ YES' : '❌ NO'}`);
        console.log(`   Token Expires: ${user.emailVerificationExpires || 'N/A'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ' + '-'.repeat(50));
      });
    }

    console.log('\n🔧 Development Mode Status:');
    console.log(`   DEV_MODE_AUTO_VERIFY: ${process.env.DEV_MODE_AUTO_VERIFY}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

checkUsers();