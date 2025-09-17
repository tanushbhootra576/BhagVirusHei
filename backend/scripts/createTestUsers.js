const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civic-pulse');
        console.log('Connected to MongoDB');

        // Clear existing test users
        await User.deleteMany({
            $or: [
                { email: { $in: ['citizen@test.com', 'gov@test.com'] } },
                { phone: { $in: ['1234567890', '9876543210'] } }
            ]
        });
        console.log('Cleared existing test users');

        // Create citizen user
        const citizenUser = new User({
            name: 'Test Citizen',
            email: 'citizen@test.com',
            phone: '1234567890',
            password: 'password123',
            role: 'citizen',
            location: {
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            isVerified: true
        });

        await citizenUser.save();
        console.log('Created citizen user:', citizenUser.email);

        // Create government user
        const govUser = new User({
            name: 'Test Government Officer',
            email: 'gov@test.com',
            phone: '9876543210',
            password: 'password123',
            role: 'government',
            department: 'Municipal Corporation',
            location: {
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
            },
            isVerified: true
        });

        await govUser.save();
        console.log('Created government user:', govUser.email);

        console.log('\nTest users created successfully!');
        console.log('Citizen user: citizen@test.com / password123');
        console.log('Government user: gov@test.com / password123');

    } catch (error) {
        console.error('Error creating test users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createTestUsers();