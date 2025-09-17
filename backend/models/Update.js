const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['news', 'announcement', 'project', 'awareness', 'event', 'other'],
        default: 'announcement'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    images: [String],
    attachments: [String],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number] // [longitude, latitude]
        },
        address: String,
        city: String,
        state: String
    },
    startDate: Date,
    endDate: Date,
    isActive: {
        type: Boolean,
        default: true
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

// Create a geospatial index for location-based queries if needed
updateSchema.index({ 'location.coordinates': '2dsphere' });

const Update = mongoose.model('Update', updateSchema);

module.exports = Update;
