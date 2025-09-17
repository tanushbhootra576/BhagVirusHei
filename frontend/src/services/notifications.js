import api from './api';

const BYPASS = import.meta.env.VITE_BYPASS_AUTH === 'true';

export const listNotifications = async (params = {}) => {
    if (BYPASS) {
        // Return mock notifications in bypass mode
        return {
            notifications: [
                { _id: 'n1', title: 'Welcome to CivicPulse', message: 'Thanks for trying the demo.', read: false, createdAt: new Date().toISOString() },
                { _id: 'n2', title: 'Issue Update', message: 'Your issue status changed to In Progress.', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() }
            ],
            unreadCount: 1,
            pagination: { total: 2, page: 1, limit: 20, pages: 1 }
        };
    }
    return api.get('/notifications', { params }).then(r => r.data);
};

export const markNotificationRead = (notificationId) => {
    if (BYPASS) return Promise.resolve({ message: 'ok' });
    return api.put('/notifications/read', { notificationIds: [notificationId] }).then(r => r.data);
};

export const markAllNotificationsRead = () => {
    if (BYPASS) return Promise.resolve({ message: 'ok' });
    return api.put('/notifications/read', { notificationIds: ['all'] }).then(r => r.data);
};

export const deleteNotification = (notificationId) => {
    if (BYPASS) return Promise.resolve({ message: 'ok' });
    return api.delete('/notifications', { data: { notificationIds: [notificationId] } }).then(r => r.data);
};
