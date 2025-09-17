const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users (optional - remove this in production)
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create sample users
        const users = [
            {
                name: 'John Citizen',
                email: 'citizen@example.com',
                phone: '+1234567890',
                password: await bcrypt.hash('password123', 10),
                role: 'citizen',
                isVerified: true,
                address: {
                    street: '123 Main St',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62701',
                    country: 'USA'
                }
            },
            {
                name: 'Jane Government',
                email: 'govt@example.com',
                phone: '+1234567891',
                password: await bcrypt.hash('password123', 10),
                role: 'government',
                department: 'Public Works',
                isVerified: true,
                address: {
                    street: '456 Government Ave',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62702',
                    country: 'USA'
                }
            },
            {
                name: 'Mike Admin',
                email: 'admin@example.com',
                phone: '+1234567892',
                password: await bcrypt.hash('admin123', 10),
                role: 'government',
                department: 'Administration',
                isVerified: true,
                address: {
                    street: '789 Admin Blvd',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62703',
                    country: 'USA'
                }
            },
            {
                name: 'Sarah Community',
                email: 'community@example.com',
                phone: '+1234567893',
                password: await bcrypt.hash('password123', 10),
                role: 'citizen',
                isVerified: true,
                address: {
                    street: '321 Community Dr',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62704',
                    country: 'USA'
                }
            }
        ];

        // Insert users
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users successfully!`);

        // Display login credentials
        console.log('\n=== LOGIN CREDENTIALS ===');
        console.log('Citizen User:');
        console.log('Email: citizen@example.com');
        console.log('Password: password123');
        console.log('');
        console.log('Government User:');
        console.log('Email: govt@example.com');
        console.log('Password: password123');
        console.log('');
        console.log('Admin User:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('');
        console.log('Community User:');
        console.log('Email: community@example.com');
        console.log('Password: password123');

        console.log('\n=== USERS SEEDED SUCCESSFULLY ===');

    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the seed function
seedUsers();
