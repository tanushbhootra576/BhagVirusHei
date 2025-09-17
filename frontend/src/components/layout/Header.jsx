import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { IconSun, IconMoon } from '../common/Icons';

const Header = ({ onHamburgerClick, isSidebarOpen, showSidebarHamburger }) => {
    const { isAuthenticated, logout, user, isGovernment, isCitizen } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const navRef = useRef();

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleUserMenu = () => setUserMenuOpen((open) => !open);
    const handleNavLinkClick = () => setNavOpen(false);

    useEffect(() => {
        if (!navOpen) return;
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setNavOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [navOpen]);

    useEffect(() => {
        setNavOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (showSidebarHamburger && isSidebarOpen) {
            setNavOpen(false);
        }
    }, [showSidebarHamburger, isSidebarOpen]);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <button
                        className={`hamburger${(showSidebarHamburger ? isSidebarOpen : navOpen) ? ' open' : ''
                            }`}
                        onClick={() => {
                            if (showSidebarHamburger) {
                                setNavOpen(false);
                                onHamburgerClick && onHamburgerClick();
                            } else {
                                setNavOpen((prev) => !prev);
                            }
                        }}
                        aria-label={
                            (showSidebarHamburger ? isSidebarOpen : navOpen)
                                ? 'Close menu'
                                : 'Open menu'
                        }
                        aria-expanded={showSidebarHamburger ? isSidebarOpen : navOpen}
                        aria-controls={showSidebarHamburger ? 'sidebar' : 'main-nav'}
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </button>

                   
                    <Link to="/" className="logo hide-on-mobile">
                        <h1>CivicPulse</h1>
                    </Link>

                    {(!showSidebarHamburger || !isSidebarOpen) && (
                        <nav
                            id="main-nav"
                            className={`main-nav${navOpen ? ' open' : ''}`}
                            ref={navRef}
                            aria-hidden={!navOpen && window.innerWidth <= 900}
                        >
                            <ul className="nav-links">
                                {isAuthenticated && (
                                    <li className="hide-on-mobile">
                                        <Link
                                            to="/dashboard"
                                            className={isActive('/dashboard') ? 'active' : ''}
                                            onClick={handleNavLinkClick}
                                            tabIndex={navOpen || window.innerWidth > 900 ? 0 : -1}
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                )}
                                {isAuthenticated && isCitizen && (
                                    <li className="hide-on-mobile">
                                        <Link
                                            to="/report-issue"
                                            className={isActive('/report-issue') ? 'active' : ''}
                                            onClick={handleNavLinkClick}
                                            tabIndex={navOpen || window.innerWidth > 900 ? 0 : -1}
                                        >
                                            Report Issue
                                        </Link>
                                    </li>
                                )}
                                {isAuthenticated && isGovernment && (
                                    <li>
                                        {/* <Link
                                            to="/analytics"
                                            className={isActive('/analytics') ? 'active' : ''}
                                            onClick={handleNavLinkClick}
                                            tabIndex={navOpen || window.innerWidth > 900 ? 0 : -1}
                                        >
                                            Analytics
                                        </Link> */}
                                    </li>
                                )}
                            </ul>
                        </nav>
                    )}

                    <div className="header-actions">
                        {/* <button
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'
                                } mode`}
                        >
                            {theme === 'light' ? <IconMoon /> : <IconSun />}
                        </button> */}

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
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item logout-item"
                                        >
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
