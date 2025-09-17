import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { listNotifications, markNotificationRead, deleteNotification, markAllNotificationsRead } from '../../services/notifications';

const Notifications = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await listNotifications();
            setItems(data.notifications || data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onMarkRead = async (id) => {
        await markNotificationRead(id);
        setItems(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    };

    const onDelete = async (id) => {
        await deleteNotification(id);
        setItems(prev => prev.filter(n => n._id !== id));
    };

    const onMarkAll = async () => {
        await markAllNotificationsRead();
        setItems(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Notifications</h2>
                    <button className="btn btn-outline" onClick={onMarkAll}>Mark all as read</button>
                </div>
                <div className="card-body">
                    {loading && <div className="text-muted">Loading...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && !items.length && <div className="text-muted">No notifications</div>}
                    <ul className="list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {items.map(n => (
                            <li key={n._id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                <div>
                                    <div style={{ fontWeight: n.read ? 400 : 600 }}>{n.title || 'Notification'}</div>
                                    {n.message && <div className="text-muted" style={{ fontSize: '0.925rem' }}>{n.message}</div>}
                                    {n.createdAt && <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{new Date(n.createdAt).toLocaleString()}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {!n.read && <button className="btn btn-sm btn-success" onClick={() => onMarkRead(n._id)}>Mark read</button>}
                                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(n._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
