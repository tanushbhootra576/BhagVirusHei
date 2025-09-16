import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app-container">
            <Header />
            <div className="dashboard-container">
                <Sidebar isOpen={sidebarOpen} />
                <button
                    className="mobile-menu-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle mobile menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
