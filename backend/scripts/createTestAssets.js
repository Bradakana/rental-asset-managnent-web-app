require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('../models/Car');
const Estate = require('../models/Estate');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rental-management')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function createTestData() {
  try {
    console.log('🚀 Creating test vendors and assets...');

    // Create test vendor 1
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

    console.log('✅ Created vendor1 with vendorId:', testVendor1._id.toString());

    // Create test vendor 2
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

    console.log('✅ Created vendor2 with vendorId:', testVendor2._id.toString());

    // Create test cars for vendor1
    const cars = [
      {
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        color: 'White',
        licensePlate: 'ABC123',
        fuel: 'Gasoline',
        transmission: 'Automatic',
        seats: 5,
        price: 50000,
        dailyRate: 80,
        mileage: 15000,
        location: 'Ulaanbaatar, Mongolia',
        image: 'https://example.com/toyota-camry.jpg',
        description: 'Comfortable and reliable sedan perfect for business trips',
        vendorId: testVendor1._id.toString()
      },
      {
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        color: 'Blue',
        licensePlate: 'XYZ789',
        fuel: 'Gasoline',
        transmission: 'Manual',
        seats: 5,
        price: 45000,
        dailyRate: 70,
        mileage: 25000,
        location: 'Ulaanbaatar, Mongolia',
        image: 'https://example.com/honda-civic.jpg',
        description: 'Fuel-efficient compact car ideal for city driving',
        vendorId: testVendor1._id.toString()
      },
      {
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        color: 'Black',
        licensePlate: 'BMW001',
        fuel: 'Gasoline',
        transmission: 'Automatic',
        seats: 7,
        price: 85000,
        dailyRate: 120,
        mileage: 8000,
        location: 'Ulaanbaatar, Mongolia',
        image: 'https://example.com/bmw-x5.jpg',
        description: 'Luxury SUV with premium features and spacious interior',
        vendorId: testVendor1._id.toString()
      }
    ];

    for (const carData of cars) {
      const car = new Car(carData);
      await car.save();
      console.log(`✅ Created car: ${car.brand} ${car.model} (${car._id})`);
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
        image: 'https://example.com/apartment1.jpg',
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
        image: 'https://example.com/studio1.jpg',
        description: 'Perfect studio for professionals, fully furnished and pet-friendly',
        propertyType: 'Studio',
        vendorId: testVendor2._id.toString()
      },
      {
        title: 'Spacious Family House',
        location: 'Suburb, Green Area',
        size: 150,
        rooms: 4,
        bathrooms: 3,
        floor: 0,
        totalFloors: 2,
        furnished: false,
        petsAllowed: true,
        price: 2000,
        image: 'https://example.com/house1.jpg',
        description: 'Large family house with garden, perfect for families with children',
        propertyType: 'House',
        vendorId: testVendor2._id.toString()
      }
    ];

    for (const estateData of estates) {
      const estate = new Estate(estateData);
      await estate.save();
      console.log(`✅ Created estate: ${estate.title} (${estate._id})`);
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

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Vendor 1 (Car Rentals): vendor1@test.com / password123');
    console.log('Vendor 2 (Real Estate): vendor2@test.com / password123');
    console.log('Regular User: user@test.com / password123');
    console.log('\n🔧 Vendor IDs:');
    console.log('Vendor 1 ID:', testVendor1._id.toString());
    console.log('Vendor 2 ID:', testVendor2._id.toString());

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestData();
