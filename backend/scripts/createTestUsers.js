const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB холболт
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/rental-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB холбогдлоо');
  } catch (error) {
    console.error('MongoDB холболтын алдаа:', error);
    process.exit(1);
  }
};

// Тест хэрэглэгчдийг үүсгэх
const createTestUsers = async () => {
  try {
    await connectDB();

    // Өмнөх тест хэрэглэгчдийг устгах
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com', 'manager@test.com'] } });

    const testUsers = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        username: 'admin',
        password: 'password123',
        role: 'admin'
      },
      {
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@test.com',
        username: 'user',
        password: 'password123',
        role: 'user'
      },
      {
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@test.com',
        username: 'manager',
        password: 'password123',
        role: 'manager'
      }
    ];

    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`${userData.role} хэрэглэгч үүсгэгдлээ: ${userData.email}`);
    }

    console.log('Бүх тест хэрэглэгчид амжилттай үүсгэгдлээ!');
    process.exit(0);
  } catch (error) {
    console.error('Алдаа:', error);
    process.exit(1);
  }
};

createTestUsers();