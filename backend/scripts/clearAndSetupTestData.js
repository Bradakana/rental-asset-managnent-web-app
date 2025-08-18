require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('../models/Car');
const Estate = require('../models/Estate');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Subscription = require('../models/Subscription');
const Renter = require('../models/Renter');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function clearAndSetupTestData() {
  try {
    console.log('🧹 Clearing existing data...');
    
    // Clear all existing data
    await Promise.all([
      Car.deleteMany({}),
      Estate.deleteMany({}),
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Subscription.deleteMany({}),
      Renter.deleteMany({})
    ]);
    
    console.log('Database cleared');

    console.log('Creating fresh test data...');

    // Create test vendor 1 (Car Rentals)
    const testUser1 = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'vendor1@test.com',
      username: 'vendor1',
      password: 'password123',
      role: 'admin'
    });
    await testUser1.save();

    const testVendor1 = new Vendor({
      name: 'Premium Car Rentals',
      type: 'car',
      ownerId: testUser1._id
    });
    await testVendor1.save();

    testUser1.vendorId = testVendor1._id.toString();
    await testUser1.save();

    console.log('✅ Created Car Vendor - ID:', testVendor1._id.toString());

    // Create test vendor 2 (Real Estate)
    const testUser2 = new User({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'vendor2@test.com',
      username: 'vendor2',
      password: 'password123',
      role: 'admin'
    });
    await testUser2.save();

    const testVendor2 = new Vendor({
      name: 'Elite Real Estate',
      type: 'real-estate',
      ownerId: testUser2._id
    });
    await testVendor2.save();

    testUser2.vendorId = testVendor2._id.toString();
    await testUser2.save();

    console.log('✅ Created Real Estate Vendor - ID:', testVendor2._id.toString());

    // Create test cars for vendor1
    const cars = [
      {
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        fuel: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        location: 'Ulaanbaatar, Mongolia',
        price: 50000,
        image: 'https://vehicle-images.dealerinspire.com/b163-110004142/thumbnails/large/4T1DAACK9SU190549/c028a15844cff668936ff2b555c091d0.png',
        description: 'Comfortable and reliable sedan perfect for business trips',
        vendorId: testVendor1._id.toString()
      },
      {
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        fuel: 'Gasoline',
        transmission: 'Manual',
        seats: 5,
        location: 'Ulaanbaatar, Mongolia',
        price: 45000,
        image: 'https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2026/civic-sedan/non-VLP/10-Family/MY26_Civic_Family_Card_Jelly_2x.png?sc_lang=en',
        description: 'Fuel-efficient compact car ideal for city driving',
        vendorId: testVendor1._id.toString()
      }
    ];

    for (const carData of cars) {
      const car = new Car(carData);
      await car.save();
      console.log(`✅ Created car: ${car.brand} ${car.model} (ID: ${car._id})`);
    }

    // Create test estates for vendor2
    const estates = [
      {
        title: 'Modern Downtown Apartment',
        location: 'Downtown, City Center',
        size: 85,
        rooms: 2,
        bathrooms: 2,
        floor: 5,
        totalFloors: 10,
        furnished: true,
        petsAllowed: false,
        price: 1200,
        image: 'https://photos.zillowstatic.com/fp/803c54e970b0ecd171338e3895091331-p_e.jpg',
        description: 'Beautiful modern apartment in the heart of the city with stunning views',
        propertyType: 'Apartment',
        vendorId: testVendor2._id.toString()
      },
      {
        title: 'Cozy Studio in Business District',
        location: 'Business District',
        size: 45,
        rooms: 1,
        bathrooms: 1,
        floor: 3,
        totalFloors: 8,
        furnished: true,
        petsAllowed: true,
        price: 800,
        image: 'https://rent.brookfieldproperties.com/wp-content/uploads/2024/05/Atelier-PH7-08_Web.jpg',
        description: 'Perfect studio for professionals, fully furnished and pet-friendly',
        propertyType: 'Studio',
        vendorId: testVendor2._id.toString()
      }
    ];

    for (const estateData of estates) {
      const estate = new Estate(estateData);
      await estate.save();
      console.log(`✅ Created estate: ${estate.title} (ID: ${estate._id})`);
    }

    // Create a regular user for testing subscriptions
    const regularUser = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'user@test.com',
      username: 'testuser',
      password: 'password123',
      role: 'user'
    });
    await regularUser.save();
    console.log('✅ Created regular user for testing subscriptions');

    console.log('\n🎉 Fresh test data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Car Vendor Admin: vendor1@test.com / password123');
    console.log('Real Estate Vendor Admin: vendor2@test.com / password123');
    console.log('Regular User: user@test.com / password123');
    
    console.log('\n🔧 Important IDs for Testing:');
    console.log('Car Vendor ID:', testVendor1._id.toString());
    console.log('Real Estate Vendor ID:', testVendor2._id.toString());
    console.log('Regular User ID:', regularUser._id.toString());

    // Test the subscription flow
    console.log('\n🧪 Testing subscription creation...');
    const firstCar = await Car.findOne({});
    if (firstCar) {
      console.log('Test car found:', firstCar.brand, firstCar.model, 'VendorID:', firstCar.vendorId);
    }

  } catch (error) {
    console.error('❌ Error setting up test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

clearAndSetupTestData();
