const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['issue-submission', 'status-update', 'assignment', 'resolution', 'upvote', 'alert', 'system'],
        required: true
    },
    relatedIssue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
