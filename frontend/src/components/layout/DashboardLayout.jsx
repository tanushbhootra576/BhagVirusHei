import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((open) => !open);
    };

    return (
        <div className="app-container">
            <Header onHamburgerClick={toggleSidebar} isSidebarOpen={sidebarOpen} showSidebarHamburger />
            <div className="dashboard-container">
                <Sidebar isOpen={sidebarOpen} />
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
