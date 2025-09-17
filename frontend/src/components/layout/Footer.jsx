// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useTheme } from '../../hooks/useTheme';

// const Footer = () => {
//     const { theme } = useTheme(); // Keeping for future theme-specific styling
//     const year = new Date().getFullYear();

//     return (
//         <footer className="footer">
//             <div className="container">
//                 <div className="footer-content">
//                     <div className="footer-section">
//                         <h3>CivicPulse</h3>
//                         <p>
//                             A platform connecting citizens and government for efficient civic issue reporting and resolution.
//                         </p>
//                     </div>

//                     <div className="footer-section">
//                         <h4>Quick Links</h4>
//                         <ul className="footer-links">
//                             <li><Link to="/">Home</Link></li>
//                             <li><Link to="/about">About</Link></li>
//                             <li><Link to="/dashboard">Dashboard</Link></li>
//                             <li><Link to="/report-issue">Report Issue</Link></li>
//                             <li><Link to="/faq">FAQ</Link></li>
//                         </ul>
//                     </div>

//                     <div className="footer-section">
//                         <h4>Connect With Us</h4>
//                         <ul className="footer-links">
//                             <li><Link to="/contact">Contact</Link></li>
//                             <li><a href="https://twitter.com/civicpulse" target="_blank" rel="noopener noreferrer">Twitter</a></li>
//                             <li><a href="https://facebook.com/civicpulse" target="_blank" rel="noopener noreferrer">Facebook</a></li>
//                             <li><a href="https://instagram.com/civicpulse" target="_blank" rel="noopener noreferrer">Instagram</a></li>
//                         </ul>
//                     </div>

//                     <div className="footer-section">
//                         <h4>Download Our App</h4>
//                         <div className="app-links">
//                             <a href="#" className="app-link">
//                                 <span>Google Play</span>
//                             </a>
//                             <a href="#" className="app-link">
//                                 <span>App Store</span>
//                             </a>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="footer-bottom">
//                     <p>&copy; {year} CivicPulse. All rights reserved.</p>
//                     <div className="footer-bottom-links">
//                         <Link to="/privacy-policy">Privacy Policy</Link>
//                         <Link to="/terms">Terms of Service</Link>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;


import React from 'react'

const Footer = () => {
    return (
        <div>Footer</div>
    )
}

export default Footer