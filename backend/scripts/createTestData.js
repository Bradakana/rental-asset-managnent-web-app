const mongoose = require('mongoose');
const Car = require('../models/Car');
const Estate = require('../models/Estate');

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

// Тест машинууд үүсгэх
const createTestCars = async () => {
  try {
    // Өмнөх тест машинуудыг устгах
    await Car.deleteMany({ vendorId: 'test-vendor' });

    const testCars = [
      {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        fuel: 'Hybrid',
        seats: 5,
        transmission: 'Automatic',
        location: 'Ulaanbaatar, Mongolia',
        price: 50,
        image: 'https://smartcdn.gprod.postmedia.digital/driving/wp-content/uploads/2022/01/2022-Toyota-Corolla-Hybrid-7.jpg',
        description: 'Reliable and economical Toyota Corolla Hybrid, perfect for city and long trips.',
        vendorId: 'test-vendor'
      },
      {
        brand: 'BMW',
        model: '320i',
        year: 2023,
        fuel: 'Gasoline',
        seats: 5,
        transmission: 'Automatic',
        location: 'Ulaanbaatar, Mongolia',
        price: 120,
        image: 'https://www.bmw.com/content/dam/bmw/common/all-models/3-series/sedan/2022/highlights/bmw-3-series-sedan-sp-desktop.jpg',
        description: 'Sporty BMW 320i with automatic transmission and leather seats.',
        vendorId: 'test-vendor'
      },
      {
        brand: 'Mercedes',
        model: 'A-Class',
        year: 2021,
        fuel: 'Diesel',
        seats: 5,
        transmission: 'Manual',
        location: 'Ulaanbaatar, Mongolia',
        price: 100,
        image: 'https://www.mercedes-benz.com/content/dam/mercedes-benz/classic/mercedes-benz-a-class/a-class-w177/stage/mercedes-benz-a-class-w177-stage-3100x1736.jpg',
        description: 'Comfortable Mercedes A-Class with diesel engine.',
        vendorId: 'test-vendor'
      }
    ];

    for (const carData of testCars) {
      const car = new Car(carData);
      await car.save();
      console.log(`Car үүсгэгдлээ: ${carData.brand} ${carData.model}`);
    }
  } catch (error) {
    console.error('Car үүсгэх алдаа:', error);
  }
};

// Тест үл хөдлөх хөрөнгө үүсгэх
const createTestEstates = async () => {
  try {
    // Өмнөх тест estates-ийг устгах
    await Estate.deleteMany({ vendorId: 'test-vendor' });

    const testEstates = [
      {
        title: 'Modern Apartment for Rent',
        location: 'Ulaanbaatar, Sukhbaatar District',
        size: 76,
        rooms: 3,
        bathrooms: 2,
        floor: 5,
        totalFloors: 10,
        furnished: true,
        petsAllowed: false,
        price: 800,
        image: 'https://www.digitalphotomentor.com/photography/2018/09/real-estate-photography-interior-photo-750x500.jpg',
        description: 'Well furnished 3-room apartment with modern amenities.',
        propertyType: 'Apartment',
        vendorId: 'test-vendor'
      },
      {
        title: 'Cozy Studio Downtown',
        location: 'Ulaanbaatar, Khan-Uul District',
        size: 35,
        rooms: 1,
        bathrooms: 1,
        floor: 2,
        totalFloors: 5,
        furnished: true,
        petsAllowed: true,
        price: 500,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        description: 'Perfect studio for young professionals.',
        propertyType: 'Studio',
        vendorId: 'test-vendor'
      }
    ];

    for (const estateData of testEstates) {
      const estate = new Estate(estateData);
      await estate.save();
      console.log(`Estate үүсгэгдлээ: ${estateData.title}`);
    }
  } catch (error) {
    console.error('Estate үүсгэх алдаа:', error);
  }
};

const createAllTestData = async () => {
  try {
    await connectDB();
    await createTestCars();
    await createTestEstates();
    console.log('Бүх тест өгөгдөл амжилттай үүсгэгдлээ!');
    process.exit(0);
  } catch (error) {
    console.error('Алдаа:', error);
    process.exit(1);
  }
};

createAllTestData();