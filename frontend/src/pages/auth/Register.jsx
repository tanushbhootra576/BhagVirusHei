import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'citizen',
        department: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (formData.role === 'government' && !formData.department.trim()) {
            newErrors.department = 'Department is required for government officials';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            const { confirmPassword: _, address, ...registrationData } = formData;

            const location = {
                city: address.split(',')[0]?.trim() || '',
                state: address.split(',')[1]?.trim() || '',
                pincode: address.split(',')[2]?.trim() || ''
            };

            const result = await register({
                ...registrationData,
                location
            });

            if (result) {
                if (result.role === 'government') {
                    navigate('/dashboard/pending-issues');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
        } catch (err) {
            console.error('Registration error:', err);
            setErrors({ general: 'An unexpected error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="back-to-home">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Home
            </Link>

            <div className="auth-card register-card">
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p>Join CivicPulse to report and track civic issues</p>
                </div>

                {errors.general && (
                    <div className="alert alert-danger">{errors.general}</div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Account Type</label>
                        <div className="role-selector">
                            <div
                                className={`role-option ${formData.role === 'citizen' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, role: 'citizen' }))}
                            >
                                <i className="fas fa-user"></i>
                                <span>Citizen</span>
                            </div>
                            <div
                                className={`role-option ${formData.role === 'government' ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, role: 'government' }))}
                            >
                                <i className="fas fa-landmark"></i>
                                <span>Government Official</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'input-error' : ''}
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'input-error' : ''}
                            placeholder="Enter your email"
                            disabled={isSubmitting}
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

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
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'input-error' : ''}
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'input-error' : ''}
                            placeholder="Confirm your password"
                            disabled={isSubmitting}
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'input-error' : ''}
                            placeholder="City, State, Pincode"
                            disabled={isSubmitting}
                        />
                        {errors.address && <div className="error-message">{errors.address}</div>}
                    </div>

                    {formData.role === 'government' && (
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
                    )}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;