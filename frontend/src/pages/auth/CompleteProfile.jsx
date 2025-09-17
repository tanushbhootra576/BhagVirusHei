import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CompleteProfile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        role: 'citizen',
        department: '',
        govtId: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if user is already fully registered
    useEffect(() => {
        if (user && user.phone && user.location?.city) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (formData.role === 'government') {
            if (!formData.department.trim()) {
                newErrors.department = 'Department is required';
            }

            if (!formData.govtId.trim()) {
                newErrors.govtId = 'Government ID is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create location object from address
            const location = {
                city: formData.address.split(',')[0]?.trim() || '',
                state: formData.address.split(',')[1]?.trim() || '',
                pincode: formData.address.split(',')[2]?.trim() || ''
            };

            // Update user profile
            const result = await updateProfile({
                phone: formData.phone,
                location,
                role: formData.role,
                department: formData.role === 'government' ? formData.department : undefined
            });

            if (result.success) {
                // Redirect based on user role
                if (result.user.role === 'government') {
                    navigate('/dashboard/pending-issues');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrors({ general: 'An error occurred while updating your profile.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Complete Your Profile</h2>
                    <p>Please provide the following information to complete your registration</p>
                </div>

                {errors.general && (
                    <div className="alert alert-danger">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'input-error' : ''}
                            placeholder="Enter your phone number"
                            disabled={isSubmitting}
                        />
                        {errors.phone && <div className="error-message">{errors.phone}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'input-error' : ''}
                            placeholder="Enter your address (City, State, Pincode)"
                            disabled={isSubmitting}
                            rows="2"
                        ></textarea>
                        <small>Format: City, State, Pincode</small>
                        {errors.address && <div className="error-message">{errors.address}</div>}
                    </div>

                    <div className="form-group">
                        <label>I am registering as:</label>
                        <div className="role-selector">
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="citizen"
                                    name="role"
                                    value="citizen"
                                    checked={formData.role === 'citizen'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="citizen">Citizen</label>
                            </div>
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="government"
                                    name="role"
                                    value="government"
                                    checked={formData.role === 'government'}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="government">Government Official</label>
                            </div>
                        </div>
                    </div>

                    {formData.role === 'government' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className={errors.department ? 'input-error' : ''}
                                    placeholder="Enter your department"
                                    disabled={isSubmitting}
                                />
                                {errors.department && <div className="error-message">{errors.department}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="govtId">Government ID</label>
                                <input
                                    type="text"
                                    id="govtId"
                                    name="govtId"
                                    value={formData.govtId}
                                    onChange={handleChange}
                                    className={errors.govtId ? 'input-error' : ''}
                                    placeholder="Enter your government ID"
                                    disabled={isSubmitting}
                                />
                                {errors.govtId && <div className="error-message">{errors.govtId}</div>}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
