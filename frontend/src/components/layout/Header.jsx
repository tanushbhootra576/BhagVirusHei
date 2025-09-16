import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { IconSun, IconMoon } from '../common/Icons';

const Header = () => {
    const { isAuthenticated, logout, user, isGovernment, isCitizen } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Check if the current route is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleUserMenu = () => {
        setUserMenuOpen(!userMenuOpen);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <h1>CivicPulse</h1>
                    </Link>

                    <nav className="main-nav">
                        <ul className="nav-links">
                            <li>
                                <Link to="/" className={isActive('/') ? 'active' : ''}>
                                    Home
                                </Link>
                            </li>

                            {isAuthenticated && (
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className={isActive('/dashboard') ? 'active' : ''}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}

                            {isAuthenticated && isCitizen && (
                                <li>
                                    <Link
                                        to="/report-issue"
                                        className={isActive('/report-issue') ? 'active' : ''}
                                    >
                                        Report Issue
                                    </Link>
                                </li>
                            )}

                            {isAuthenticated && isGovernment && (
                                <li>
                                    <Link
                                        to="/analytics"
                                        className={isActive('/analytics') ? 'active' : ''}
                                    >
                                        Analytics
                                    </Link>
                                </li>
                            )}

                            <li>
                                <Link
                                    to="/about"
                                    className={isActive('/about') ? 'active' : ''}
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="header-actions">
                        <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <IconMoon /> : <IconSun />}
                        </button>

                        {isAuthenticated ? (
                            <div className="user-menu">
                                <div className="profile-link" onClick={toggleUserMenu}>
                                    <div className="avatar">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="user-name">{user?.name || 'User'}</span>
                                </div>
                                {userMenuOpen && (
                                    <div className="user-menu-dropdown">
                                        <Link to="/profile" className="dropdown-item">
                                            Profile
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            Settings
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item logout-item">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-primary">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-outline">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
