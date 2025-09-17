import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
