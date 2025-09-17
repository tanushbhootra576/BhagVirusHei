import React from 'react';
import { Link } from 'react-router-dom';
import { IconLocation, IconCamera, IconSearch, IconHandshake, IconChart, IconCalendar, IconThumbUp, IconBuilding, IconCertificate, IconShield, IconUser } from '../../components/common/Icons';
import '../../styles/home.css';

// Sample hero image - replace with actual image path when available
import heroImage from '../../assets/react.svg';

const Home = () => {
    // const [searchQuery, setSearchQuery] = useState(''); // Commented out unused state

    // Sample data for UI demonstration
    const recentIssues = [
        {
            id: 1,
            title: 'Pothole on Main Street',
            category: 'Roads',
            location: 'Main St & 5th Ave',
            status: 'In Progress',
            date: '2023-04-15',
            upvotes: 24
        },
        {
            id: 2,
            title: 'Broken Streetlight',
            category: 'Electricity',
            location: 'Park Avenue',
            status: 'Pending',
            date: '2023-04-14',
            upvotes: 15
        },
        {
            id: 3,
            title: 'Garbage Collection Missed',
            category: 'Sanitation',
            location: 'River Road',
            status: 'Resolved',
            date: '2023-04-10',
            upvotes: 32
        }
    ];

    const alerts = [
        {
            id: 1,
            title: 'Scheduled Water Outage',
            description: 'Water supply will be disrupted in the downtown area on Sunday from 10 AM to 2 PM due to maintenance work.',
            severity: 'medium',
            date: '2023-04-18'
        },
        {
            id: 2,
            title: 'Road Closure Alert',
            description: 'Main Street will be closed for resurfacing from April 20-25. Please use alternate routes.',
            severity: 'high',
            date: '2023-04-20'
        }
    ];

    // Search functionality commented out since we removed the search form
    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     // Implement search functionality
    //     console.log('Searching for:', searchQuery);
    // };

    // Function to determine status class for styling
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'resolved':
                return 'status-resolved';
            case 'in progress':
                return 'status-progress';
            case 'pending':
                return 'status-pending';
            default:
                return '';
        }
    };

    // Function to determine alert severity class
    const getSeverityClass = (severity) => {
        switch (severity.toLowerCase()) {
            case 'high':
                return 'severity-high';
            case 'medium':
                return 'severity-medium';
            case 'low':
                return 'severity-low';
            default:
                return '';
        }
    };

    return (
        <div className="home-page">
            {/* Top banner for government site */}
            <div className="gov-top-banner">
                <div className="container">
                    <div className="gov-banner-content" style={{ display: 'flex', alignItems: 'center', justifyContent: "space-around", gap: '10px' }}>
                        <div className="national-emblem"></div>
                        <h1 className="gov-site-title">CivicPulse</h1>
                        <div className="gov-subtitle">Ministry of Urban Development</div>
                    </div>
                </div>
            </div>

            {/* Main navigation */}
            <div className="main-navigation">
                <div className="container">
                    <div className="nav-content">
                        <div className="nav-left">
                            <select className="language-selector" defaultValue="en">
                                <option value="en">English</option>
                                <option value="hi">हिंदी</option>
                                <option value="ta">தமிழ்</option>
                                <option value="te">తెలుగు</option>
                                <option value="bn">বাংলা</option>
                            </select>
                            <button className="accessibility-btn" aria-label="Accessibility Options">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        <nav className="main-nav">
                            <Link to="/" className="nav-item active">Home</Link>
                            <Link to="/about" className="nav-item">About</Link>
                        </nav>
                        <div className="nav-right">
                            <Link to="/login" className="login-btn">Login</Link>
                            <Link to="/register" className="register-btn">Register</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero section with government branding */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="gov-badge">
                                <span>Government Initiative</span>
                            </div>
                            <h1>Digital Governance for Urban Issues</h1>
                            <p>
                                An official platform empowering citizens to report civic issues directly to
                                government authorities. Track resolutions and participate in building better communities.
                            </p>

                            {/* <div className="hero-search">
                                    <form onSubmit={handleSearch} className="search-form">
                                        <div className="search-input-container">
                                            <IconSearch />
                                            <input
                                                type="text"
                                                placeholder="Search for civic issues by location or category..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            Search
                                        </button>
                                    </form>
                                </div> */}

                            <div className="hero-actions">
                                <Link to="/register" className="btn btn-primary">
                                    Citizen Registration
                                </Link>
                                <Link to="/login" className="btn btn-secondary">
                                    Official Login
                                </Link>
                            </div>
                        </div>

                        <div className="hero-image">
                            <div className="image-container">
                                <img src={heroImage} alt="Digital India initiative for civic governance" />
                                <div className="image-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official announcement ticker */}
            <section className="announcement-ticker">
                <div className="container">
                    <div className="ticker-label">Important Updates:</div>
                    <div className="ticker-content">
                        <div className="ticker-animation">
                            <span>Digital India Week celebrations from Sept 15-21, 2025</span>
                            <span className="ticker-divider"></span>
                            <span>Smart City Project expands to 15 new cities</span>
                            <span className="ticker-divider"></span>
                            <span>New Digital Service Portal launching next month</span>
                            <span className="ticker-divider"></span>
                            <span>Government e-Marketplace crosses 10 million registered users</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services grid section */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Citizen Services</h2>
                        <p>Access government services directly through our digital platform</p>
                    </div>

                    <div className="services-grid">
                        <Link to="/report-issue" className="service-card">
                            <div className="service-icon"><IconCamera /></div>
                            <h3>Report Issue</h3>
                            <p>Submit civic problems with photos and location</p>
                        </Link>

                        <Link to="/dashboard/my-issues" className="service-card">
                            <div className="service-icon"><IconSearch /></div>
                            <h3>Track Issues</h3>
                            <p>Monitor the status of your reported issues</p>
                        </Link>

                        <Link to="/departments" className="service-card">
                            <div className="service-icon"><IconBuilding /></div>
                            <h3>Department Directory</h3>
                            <p>Contact information for government departments</p>
                        </Link>

                        <Link to="/document-verification" className="service-card">
                            <div className="service-icon"><IconCertificate /></div>
                            <h3>Document Verification</h3>
                            <p>Verify official documents and certificates</p>
                        </Link>

                        <Link to="/public-safety" className="service-card">
                            <div className="service-icon"><IconShield /></div>
                            <h3>Public Safety</h3>
                            <p>Emergency contacts and safety guidelines</p>
                        </Link>

                        <Link to="/citizen-forum" className="service-card">
                            <div className="service-icon"><IconUser /></div>
                            <h3>Citizen Forum</h3>
                            <p>Community discussions on civic matters</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Recent issues section with government style */}
            <section className="recent-issues-section">
                <div className="container">
                    <div className="section-header with-line">
                        <h2>Recently Reported Issues</h2>
                        <Link to="/issues" className="view-all-link">
                            View All Issues <span className="arrow-right">→</span>
                        </Link>
                    </div>

                    <div className="issue-cards">
                        {recentIssues.map((issue) => (
                            <div key={issue.id} className="gov-issue-card">
                                <div className="issue-status-flag">
                                    <span className={`status-indicator ${getStatusClass(issue.status)}`}></span>
                                    <span className="status-text">{issue.status}</span>
                                </div>

                                <div className="issue-body">
                                    <h3 className="issue-title">
                                        <Link to={`/issues/${issue.id}`}>{issue.title}</Link>
                                    </h3>

                                    <div className="issue-meta">
                                        <div className="meta-item">
                                            <IconLocation />
                                            <span>{issue.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <IconCalendar />
                                            <span>{issue.date}</span>
                                        </div>
                                        <div className="meta-item category">
                                            <span>{issue.category}</span>
                                        </div>
                                    </div>

                                    <div className="issue-actions">
                                        <span className="upvote-count">
                                            <IconThumbUp />
                                            <span>{issue.upvotes} Supporters</span>
                                        </span>
                                        <Link to={`/issues/${issue.id}`} className="view-details-link">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Official alerts section */}
            <section className="alerts-section">
                <div className="container">
                    <div className="section-header with-line">
                        <h2>Official Notifications</h2>
                        <Link to="/alerts" className="view-all-link">
                            View All Notifications <span className="arrow-right">→</span>
                        </Link>
                    </div>

                    <div className="alerts-container">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`gov-alert-card ${getSeverityClass(alert.severity)}`}
                            >
                                <div className="alert-severity-indicator"></div>
                                <div className="alert-content">
                                    <div className="alert-header">
                                        <h3>{alert.title}</h3>
                                        <span className="alert-date">Issued: {alert.date}</span>
                                    </div>
                                    <p className="alert-description">{alert.description}</p>
                                    <Link to={`/alerts/${alert.id}`} className="alert-link">
                                        Official Details <span className="arrow-right">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Statistics with government branding */}
            <section className="gov-stats-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Digital Governance Impact</h2>
                        <p>Real-time statistics on citizen engagement and government response</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-number">1,42,780</div>
                            <div className="stat-label">Total Issues Reported</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-number">87.6%</div>
                            <div className="stat-label">Resolution Rate</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-number">8,24,150</div>
                            <div className="stat-label">Registered Citizens</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="stat-number">36 Hours</div>
                            <div className="stat-label">Avg. Response Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Government scheme banner */}
            <section className="scheme-banner">
                <div className="container">
                    <div className="scheme-content">
                        <div className="scheme-logo">
                            <div className="logo-placeholder"></div>
                        </div>
                        <div className="scheme-text">
                            <h2>Digital India Initiative</h2>
                            <p>CivicPulse is part of the Digital India initiative to empower citizens and improve governance through technology.</p>
                        </div>
                        <Link to="/digital-india" className="scheme-button">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bottom section with resources and links */}
            <section className="resources-section">
                <div className="container">
                    <div className="resources-grid">
                        <div className="resource-col">
                            <h3>Quick Links</h3>
                            <ul className="resource-links">
                                <li><Link to="/about">About CivicPulse</Link></li>
                                <li><Link to="/how-it-works">How It Works</Link></li>
                                <li><Link to="/faqs">Frequently Asked Questions</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                                <li><Link to="/terms">Terms & Conditions</Link></li>
                                <li><Link to="/privacy">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        <div className="resource-col">
                            <h3>Government Resources</h3>
                            <ul className="resource-links">
                                <li><a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer">National Portal of India</a></li>
                                <li><a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer">MyGov Portal</a></li>
                                <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer">Digital India</a></li>
                                <li><a href="https://data.gov.in" target="_blank" rel="noopener noreferrer">Open Government Data</a></li>
                                <li><a href="https://smartcities.gov.in" target="_blank" rel="noopener noreferrer">Smart Cities Mission</a></li>
                                <li><a href="https://swachhbharat.mygov.in" target="_blank" rel="noopener noreferrer">Swachh Bharat Mission</a></li>
                            </ul>
                        </div>

                        <div className="resource-col">
                            <h3>Connect With Us</h3>
                            <p>Stay updated with the latest government initiatives and civic developments</p>
                            <div className="social-links">
                                <a href="#" className="social-link" aria-label="Facebook">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Twitter">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M23 3C22.0424 3.67548 20.9821 4.19211 19.86 4.53C19.2577 3.83751 18.4573 3.34669 17.567 3.12393C16.6767 2.90116 15.7395 2.9572 14.8821 3.28445C14.0247 3.61171 13.2884 4.1944 12.773 4.95372C12.2575 5.71303 11.9877 6.61234 12 7.53V8.53C10.2426 8.57557 8.50127 8.18581 6.93101 7.39545C5.36074 6.60508 4.01032 5.43864 3 4C3 4 -1 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C10 24 21 19 21 7.5C20.9991 7.22145 20.9723 6.94359 20.92 6.67C21.9406 5.66349 22.6608 4.39271 23 3V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="Instagram">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7616 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12838C15.4785 9.73529 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#" className="social-link" aria-label="YouTube">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92921 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991235 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 22.9962 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42V6.42Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>

                            <div className="newsletter">
                                <h4>Subscribe to Newsletter</h4>
                                <form className="newsletter-form">
                                    <input type="email" placeholder="Your email address" required />
                                    <button type="submit" className="btn-subscribe">Subscribe</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official footer */}
            <div className="gov-footer">
                <div className="container">
                    <div className="gov-footer-content">
                        <div className="gov-footer-logo">
                            <div className="national-emblem-small"></div>
                            <div className="gov-footer-text">
                                <div className="gov-name">Government of India</div>
                                <div className="ministry-name">Ministry of Urban Development</div>
                            </div>
                        </div>

                        <div className="gov-footer-info">
                            <p>© 2025 CivicPulse. All Rights Reserved.</p>
                            <p>Last Updated: September 6, 2025</p>
                            <p>Site Visitors: 12,458,785</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;