import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [form, setForm] = useState({ name: '', city: '', state: '', pincode: '' });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                city: user.location?.city || '',
                state: user.location?.state || '',
                pincode: user.location?.pincode || ''
            });
        }
    }, [user]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg('');
        try {
            const payload = {
                name: form.name,
                location: { city: form.city, state: form.state, pincode: form.pincode }
            };
            await updateProfile(payload);
            setMsg('Profile updated');
            // optionally refresh user via context hook if exposed
        } catch (err) {
            setMsg(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header"><h2>My Profile</h2></div>
                <div className="card-body">
                    <form onSubmit={onSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" value={form.name} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input name="city" value={form.city} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input name="state" value={form.state} onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <label>Pincode</label>
                            <input name="pincode" value={form.pincode} onChange={onChange} />
                        </div>
                        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                    </form>
                    {msg && <div className="alert alert-info" style={{ marginTop: '1rem' }}>{msg}</div>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
