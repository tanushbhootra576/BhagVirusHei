const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['flood', 'earthquake', 'heavy-rain', 'cyclone', 'heatwave', 'other'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    location: {
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        city: String,
        state: String,
        radius: Number // Affected radius in KM
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    source: {
        type: String,
        required: true
    },
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

// Create a geospatial index for location-based queries
alertSchema.index({ 'location.coordinates': '2dsphere' });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
