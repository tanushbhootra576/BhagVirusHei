import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';

const Settings = () => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');
    const { changePassword } = useAuth();

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmNewPassword) {
            setMsg('New passwords do not match');
            return;
        }
        setSaving(true);
        setMsg('');
        try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
            setMsg('Password changed successfully');
            setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err) {
            setMsg(err.response?.data?.message || 'Change password failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header"><h2>Settings</h2></div>
                <div className="card-body">
                    <form onSubmit={onSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Current Password</label>
                            <input type="password" name="currentPassword" value={form.currentPassword} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" name="newPassword" value={form.newPassword} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={onChange} />
                        </div>
                        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update Password'}</button>
                    </form>
                    {msg && <div className="alert alert-info" style={{ marginTop: '1rem' }}>{msg}</div>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
