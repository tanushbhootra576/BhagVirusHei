require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Test user data
const testUsers = [
    // Citizen test user
    {
        name: 'Test Citizen',
        email: 'testcitizen@civicpulse.org',
        phone: '1234567890',
        password: 'password123',
        role: 'citizen',
        location: {
            city: 'Test City',
            state: 'Test State',
            pincode: '123456'
        },
        isVerified: true
    },
    // Government test user
    {
        name: 'Test Official',
        email: 'testofficial@civicpulse.org',
        phone: '0987654321',
        password: 'password123',
        role: 'government',
        department: 'Public Works',
        location: {
            city: 'Test City',
            state: 'Test State',
            pincode: '123456'
        },
        isVerified: true
    }
];

// Function to seed test users
const seedTestUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-pulse');
        console.log('Connected to MongoDB');

        // Check if users already exist
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });

            if (existingUser) {
                console.log(`User ${userData.email} already exists`);
            } else {
                // Create new user
                const newUser = new User(userData);
                await newUser.save();
                console.log(`Created test user: ${userData.email}`);
            }
        }

        console.log('Test users seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding test users:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedTestUsers();
