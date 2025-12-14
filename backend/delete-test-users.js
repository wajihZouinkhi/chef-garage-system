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

async function deleteTestUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️ Deleting test users...');
    
    const usersToDelete = ['wajihzouinkhi', 'wajih22', 'wajihzouinkhi1', 'wajihzouinkhi2'];
    
    const result = await User.deleteMany({
      username: { $in: usersToDelete }
    });

    console.log(`✅ Deleted ${result.deletedCount} test users`);

    // Show remaining users
    const remainingUsers = await User.find({}).select('username email role');
    console.log('\n📊 Remaining users:');
    if (remainingUsers.length === 0) {
      console.log('   No users found');
    } else {
      remainingUsers.forEach(user => {
        console.log(`   👤 ${user.username} (${user.role}) - ${user.email}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

deleteTestUsers();