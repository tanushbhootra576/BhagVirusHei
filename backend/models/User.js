const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['citizen', 'government'],
        default: 'citizen'
    },
    department: {
        type: String,
        required: function () {
            return this.role === 'government';
        }
    },
    location: {
        city: String,
        state: String,
        pincode: String
    },
    profilePicture: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    points: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String,
        description: String,
        awardedOn: Date
    }],
    preferredLanguage: {
        type: String,
        enum: ['english', 'hindi', 'local'],
        default: 'english'
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
