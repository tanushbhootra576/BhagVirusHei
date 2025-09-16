import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';
import issuesService from '../../services/issues';
import { formatDistanceToNow } from 'date-fns';
import {
    IconLocation,
    IconCalendar,
    IconEye,
    IconChart,
    IconSearch,
    IconFilter,
    IconDownload,
    IconRefresh,
    IconPlus
} from '../../components/common/Icons';
import IssueChatPanel from '../../components/issues/IssueChatPanel.jsx';

const MyIssues = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [issues, setIssues] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [error, setError] = useState(null);


    // Available categories for filtering
    const categories = [
        'Roads & Infrastructure',
        'Electricity',
        'Water Supply',
        'Waste Management',
        'Public Safety',
        'Parks & Recreation',
        'Traffic',
        'Other'
    ];

    useEffect(() => {
        if (user) {
            fetchMyIssues();
        }
    }, [user]);

    const fetchMyIssues = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await issuesService.getMyIssues();
            if (response.success) {
                setIssues(response.data || []);
            } else {
                setError(response.error || 'Failed to fetch issues');
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
            setError('Failed to fetch issues. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchMyIssues();
        setIsRefreshing(false);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    const handleTrackIssue = (issue) => {
        try {
            console.log('[MyIssues] handleTrackIssue clicked issue raw:', issue);
            if (!issue) {
                console.warn('[MyIssues] handleTrackIssue received falsy issue');
                return;
            }
            // Basic shape validation
            if (!issue.id || !issue.title) {
                console.warn('[MyIssues] issue missing critical fields', Object.keys(issue || {}));
            }
            setSelectedIssue(issue);
            setIsTrackingModalOpen(true);
        } catch (err) {
            console.error('[MyIssues] handleTrackIssue error', err);
        }
    };

    const closeTrackingModal = () => {
        setIsTrackingModalOpen(false);
        setSelectedIssue(null);
    };

    const exportIssues = () => {
        const csvContent = [
            ['ID', 'Title', 'Category', 'Status', 'Location', 'Date Reported'],
            ...filteredAndSortedIssues.map(issue => [
                issue.id,
                issue.title,
                issue.category,
                issue.status,
                issue.location,
                new Date(issue.date).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-issues.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'in progress':
                return 'status-inprogress';
            case 'resolved':
                return 'status-resolved';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-default';
        }
    };



    // Filter and sort issues
    const filteredAndSortedIssues = React.useMemo(() => {
        let filtered = issues.filter(issue => {
            // Filter by status tab
            if (activeTab !== 'all' && issue.status.toLowerCase() !== activeTab.toLowerCase()) {
                return false;
            }

            // Filter by search term
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                return (
                    issue.title.toLowerCase().includes(searchLower) ||
                    issue.category.toLowerCase().includes(searchLower) ||
                    issue.location.toLowerCase().includes(searchLower) ||
                    issue.id.toString().includes(searchLower)
                );
            }

            // Filter by category
            if (selectedCategory && issue.category !== selectedCategory) {
                return false;
            }

            return true;
        });

        // Sort issues
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [issues, activeTab, searchTerm, selectedCategory, sortBy]);

    // Get issue statistics
    const issueStats = React.useMemo(() => {
        const stats = {
            total: issues.length,
            pending: 0,
            inProgress: 0,
            resolved: 0,
            rejected: 0
        };

        issues.forEach(issue => {
            const status = issue.status.toLowerCase().replace(' ', '');
            if (status === 'pending') stats.pending++;
            else if (status === 'inprogress') stats.inProgress++;
            else if (status === 'resolved') stats.resolved++;
            else if (status === 'rejected') stats.rejected++;
        });

        return stats;
    }, [issues]);

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div className="dashboard-header-content">
                    <div>
                        <h1>My Reported Issues</h1>
                        <p>Track and manage all your reported civic issues</p>
                    </div>
                    <div className="dashboard-header-actions">
                        <button
                            onClick={handleRefresh}
                            className="btn btn-outline btn-sm"
                            disabled={isRefreshing}
                        >
                            <IconRefresh />
                            {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button
                            onClick={exportIssues}
                            className="btn btn-outline btn-sm"
                        >
                            <IconDownload />
                            Export CSV
                        </button>
                        <Link to="/report-issue" className="btn btn-primary">
                            <IconPlus />
                            Report New Issue
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon total-icon">
                        <IconChart />
                    </div>
                    <div className="stat-content">
                        <h3>Total Issues</h3>
                        <div className="stat-number">{issueStats.total}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pending-icon">
                        <IconCalendar />
                    </div>
                    <div className="stat-content">
                        <h3>Pending</h3>
                        <div className="stat-number">{issueStats.pending}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon progress-icon">
                        <IconChart />
                    </div>
                    <div className="stat-content">
                        <h3>In Progress</h3>
                        <div className="stat-number">{issueStats.inProgress}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon resolved-icon">
                        <IconChart />
                    </div>
                    <div className="stat-content">
                        <h3>Resolved</h3>
                        <div className="stat-number">{issueStats.resolved}</div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="dashboard-filters">
                <div className="filter-tabs">
                    <button
                        onClick={() => handleTabChange('all')}
                        className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
                    >
                        All ({issueStats.total})
                    </button>
                    <button
                        onClick={() => handleTabChange('pending')}
                        className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
                    >
                        Pending ({issueStats.pending})
                    </button>
                    <button
                        onClick={() => handleTabChange('in progress')}
                        className={`filter-tab ${activeTab === 'in progress' ? 'active' : ''}`}
                    >
                        In Progress ({issueStats.inProgress})
                    </button>
                    <button
                        onClick={() => handleTabChange('resolved')}
                        className={`filter-tab ${activeTab === 'resolved' ? 'active' : ''}`}
                    >
                        Resolved ({issueStats.resolved})
                    </button>
                </div>

                <div className="filter-controls">
                    <div className="search-box">
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Search by title, category, location, or ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="filter-select"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">By Title</option>
                        <option value="status">By Status</option>
                        <option value="category">By Category</option>
                    </select>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="alert alert-error">
                    <p>{error}</p>
                    <button onClick={handleRefresh} className="btn btn-sm btn-outline">
                        Try Again
                    </button>
                </div>
            )}

            {/* Issues List */}
            <div className="issues-container">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading your issues...</p>
                    </div>
                ) : filteredAndSortedIssues.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <IconChart />
                        </div>
                        <h3>No issues found</h3>
                        <p>
                            {activeTab !== 'all'
                                ? `You don't have any ${activeTab} issues.`
                                : searchTerm
                                    ? "No issues match your search criteria."
                                    : "You haven't reported any issues yet."}
                        </p>
                        {!searchTerm && activeTab === 'all' && (
                            <Link to="/report-issue" className="btn btn-primary">
                                Report Your First Issue
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="issues-grid">
                        {filteredAndSortedIssues.map((issue) => (
                            <div key={issue.id} className="issue-card">
                                <div className="issue-card-header">
                                    <div className="issue-id">#{issue.id}</div>
                                    <div className={`status-badge ${getStatusClass(issue.status)}`}>
                                        {issue.status}
                                    </div>
                                </div>

                                <div className="issue-card-content">
                                    <h3 className="issue-title">{issue.title}</h3>
                                    <p className="issue-category">{issue.category}</p>

                                    <div className="issue-meta">
                                        <div className="meta-item">
                                            <IconLocation />
                                            <span>{issue.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <IconCalendar />
                                            <span>{formatDistanceToNow(new Date(issue.date), { addSuffix: true })}</span>
                                        </div>
                                        {issue.updates && issue.updates.length > 0 && (
                                            <div className="meta-item">
                                                <span className="updates-count">{issue.updates.length} updates</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="issue-card-actions">
                                    <button
                                        onClick={() => handleTrackIssue(issue)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        <IconEye />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Issue Tracking Modal */}
            {isTrackingModalOpen && selectedIssue && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Issue Details & Timeline</h3>
                            <button onClick={closeTrackingModal} className="modal-close">
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <div className="issue-details-grid">
                                <div className="detail-item">
                                    <label>Issue ID</label>
                                    <span>#{selectedIssue.id || selectedIssue._id || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Status</label>
                                    <span className={`status-badge ${getStatusClass(selectedIssue.status)}`}>
                                        {selectedIssue.status || 'unknown'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Category</label>
                                    <span>{selectedIssue.category || '—'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Location</label>
                                    <span>{selectedIssue.location || selectedIssue.location?.address || '—'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Reported</label>
                                    <span>{selectedIssue.date ? new Date(selectedIssue.date).toLocaleDateString() : '—'}</span>
                                </div>
                            </div>

                            <div className="issue-description">
                                <h4>Description</h4>
                                <p>{selectedIssue.description || selectedIssue.title || 'No description provided.'}</p>
                            </div>

                            <div className="timeline-section">
                                <h4>Progress Timeline</h4>
                                <div className="timeline">
                                    {Array.isArray(selectedIssue.updates) && selectedIssue.updates.length > 0 ? (
                                        selectedIssue.updates.map((update, index) => (
                                            <div key={index} className="timeline-item">
                                                <div className={`timeline-marker ${update.type}`}></div>
                                                <div className="timeline-content">
                                                    <div className="timeline-message">{update.message}</div>
                                                    {update.details && (
                                                        <div className="timeline-details">{update.details}</div>
                                                    )}
                                                    <div className="timeline-date">
                                                        {update.date ? formatDistanceToNow(new Date(update.date), { addSuffix: true }) : '—'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="timeline-empty">
                                            <p>No updates yet. We'll notify you when there's progress on your issue.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="chat-section">
                                <h4>Discussion</h4>
                                <IssueChatPanel issueId={selectedIssue.id || selectedIssue._id} assumeReporter={true} />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeTrackingModal} className="btn btn-primary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default MyIssues;
