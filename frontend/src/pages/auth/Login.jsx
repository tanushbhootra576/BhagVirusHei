import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('citizen');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, error, setError } = useAuth();
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();

    // Clear errors when changing roles
    useEffect(() => {
        setError('');
        setAuthError('');
    }, [role, setError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAuthError('');

        try {
            if (!email || !password) {
                setAuthError('Please enter both email and password');
                return;
            }

            const result = await login(email, password);
            console.log('Login result:', result);
            if (!result) {
                setAuthError('Login failed. Please check your credentials.');
            } else {
                console.log('User role:', result.role);
                // Navigate based on user role
                if (result.role === 'government') {
                    console.log('Navigating to government dashboard');
                    navigate('/dashboard/pending-issues');
                } else {
                    console.log('Navigating to citizen dashboard');
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setAuthError(err.message || 'An error occurred during login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-back-link">
                <Link to="/">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>
            </div>

            <div className="auth-card">
                <div className="auth-header">
                    <h2>Login to CivicPulse</h2>
                    <p>Access your account to manage civic issues</p>
                </div>

                {(error || authError) && (
                    <div className="auth-error">
                        <i className="fas fa-exclamation-circle"></i>
                        {error || authError}
                    </div>
                )}

                <div className="role-selector">
                    <div
                        className={`role-option ${role === 'citizen' ? 'active' : ''}`}
                        onClick={() => setRole('citizen')}
                    >
                        <i className="fas fa-user"></i>
                        <span>Citizen</span>
                    </div>
                    <div
                        className={`role-option ${role === 'government' ? 'active' : ''}`}
                        onClick={() => setRole('government')}
                    >
                        <i className="fas fa-landmark"></i>
                        <span>Government Official</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                disabled={isSubmitting}
                                required
                            />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                                required
                            />
                    </div>
                    <button
                        type="submit"
                        className="auth-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
