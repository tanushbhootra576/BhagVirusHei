import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout';

const NotFound = () => {
    return (
        <MainLayout>
            <div className="error-container">
                <div className="error-content">
                    <h1 className="error-title">404</h1>
                    <h2>Page Not Found</h2>
                    <p>
                        The page you are looking for might have been removed, had its name changed,
                        or is temporarily unavailable.
                    </p>
                    <div className="error-actions">
                        <Link to="/" className="btn btn-primary">
                            Go to Homepage
                        </Link>
                        <Link to="/dashboard" className="btn btn-outline">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default NotFound;
