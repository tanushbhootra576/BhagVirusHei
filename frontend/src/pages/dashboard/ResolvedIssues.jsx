import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { getResolvedIssues } from '../../services/issues';
import mockData from '../../utils/mockData';

const ResolvedIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: ''
    });

    useEffect(() => {
        fetchResolvedIssues();
    }, []);

    const fetchResolvedIssues = async () => {
        setLoading(true);
        try {
            const response = await getResolvedIssues();
            if (response.success) {
                setIssues(response.data);
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch resolved issues. Please try again later.');
            console.error('Error fetching resolved issues:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDetailsModal = (issue) => {
        setSelectedIssue(issue);
        setShowDetailsModal(true);
    };

    const closeModal = () => {
        setShowDetailsModal(false);
        setSelectedIssue(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const calculateResolutionTime = (submitted, resolved) => {
        if (!submitted || !resolved) return 'N/A';

        const start = new Date(submitted);
        const end = new Date(resolved);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays === 1 ? '1 day' : `${diffDays} days`;
    };

    // Filter issues based on selected filters and search query
    const filteredIssues = issues.filter(issue => {
        const matchesDepartment = filterDepartment
            ? issue.assignedTo?.department === filterDepartment
            : true;

        const matchesCategory = filterCategory
            ? issue.category === filterCategory
            : true;

        const matchesSearch = searchQuery
            ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.reporter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.assignedTo?.official?.name?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        let matchesDateRange = true;
        if (dateRange.start && dateRange.end) {
            const resolvedDate = new Date(issue.resolvedDate);
            const startDate = new Date(dateRange.start);
            const endDate = new Date(dateRange.end);
            endDate.setHours(23, 59, 59); // Include the end date fully

            matchesDateRange = resolvedDate >= startDate && resolvedDate <= endDate;
        }

        return matchesDepartment && matchesCategory && matchesSearch && matchesDateRange;
    });

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header">
                    <h2>Resolved Issues</h2>
                    <div className="header-actions">
                        <button className="btn btn-outline" onClick={fetchResolvedIssues}>
                            <i className="fas fa-sync"></i> Refresh
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {/* Filters and Search */}
                    <div className="filters-container">
                        <div className="filter-group">
                            <select
                                className="form-control"
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                            >
                                <option value="">All Departments</option>
                                {mockData.departments.map(dept => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                className="form-control"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {mockData.categories.map(category => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group search-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search issues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="date-filters">
                        <div className="filter-group">
                            <label>From:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            />
                        </div>
                        <div className="filter-group">
                            <label>To:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            />
                        </div>
                        <div className="filter-group">
                            <button
                                className="btn btn-outline"
                                onClick={() => setDateRange({ start: '', end: '' })}
                                disabled={!dateRange.start && !dateRange.end}
                            >
                                Clear Dates
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading resolved issues...</p>
                        </div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-clipboard-check"></i>
                            <h3>No Resolved Issues</h3>
                            <p>There are no resolved issues that match your filters.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Department</th>
                                        <th>Resolved By</th>
                                        <th>Reported On</th>
                                        <th>Resolved On</th>
                                        <th>Resolution Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map(issue => (
                                        <tr key={issue.id}>
                                            <td>
                                                <div className="issue-title">
                                                    {issue.title}
                                                    <span className={`badge badge-${issue.priority}`}>
                                                        {issue.priority}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{issue.assignedTo?.department || 'N/A'}</td>
                                            <td>{issue.assignedTo?.official?.name || 'Department Team'}</td>
                                            <td>{formatDate(issue.date)}</td>
                                            <td>{formatDate(issue.resolvedDate)}</td>
                                            <td>{calculateResolutionTime(issue.date, issue.resolvedDate)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => openDetailsModal(issue)}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Resolution Details Modal */}
            {showDetailsModal && selectedIssue && (
                <div className="modal-backdrop">
                    <div className="modal modal-lg">
                        <div className="modal-header">
                            <h3>Resolution Details</h3>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="resolution-details">
                                <div className="section">
                                    <h4>Issue Information</h4>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Title:</label>
                                            <span>{selectedIssue.title}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Category:</label>
                                            <span>
                                                {mockData.categories.find(c => c.value === selectedIssue.category)?.label || selectedIssue.category}
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <label>Reported By:</label>
                                            <span>{selectedIssue.reporter?.name || 'Anonymous'}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Reported On:</label>
                                            <span>{formatDate(selectedIssue.date)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Location:</label>
                                            <span>{selectedIssue.location?.address}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Priority:</label>
                                            <span className={`priority priority-${selectedIssue.priority}`}>
                                                {selectedIssue.priority.charAt(0).toUpperCase() + selectedIssue.priority.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Resolution Information</h4>
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <label>Assigned Department:</label>
                                            <span>{selectedIssue.assignedTo?.department || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Resolved By:</label>
                                            <span>{selectedIssue.assignedTo?.official?.name || 'Department Team'}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Resolved On:</label>
                                            <span>{formatDate(selectedIssue.resolvedDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Resolution Time:</label>
                                            <span>{calculateResolutionTime(selectedIssue.date, selectedIssue.resolvedDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Resolution Description</h4>
                                    <p className="resolution-description">
                                        {selectedIssue.resolutionDetails?.description || 'No description provided.'}
                                    </p>
                                </div>

                                {selectedIssue.resolutionDetails?.images && selectedIssue.resolutionDetails.images.length > 0 && (
                                    <div className="section">
                                        <h4>Resolution Images</h4>
                                        <div className="resolution-images">
                                            {selectedIssue.resolutionDetails.images.map((image, index) => (
                                                <div key={index} className="resolution-image">
                                                    <img src={image} alt={`Resolution ${index + 1}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="section">
                                    <h4>Status History</h4>
                                    <div className="status-timeline">
                                        {selectedIssue.statusHistory ? (
                                            selectedIssue.statusHistory.map((status, index) => (
                                                <div key={index} className="timeline-item">
                                                    <div className="timeline-marker"></div>
                                                    <div className="timeline-content">
                                                        <div className="timeline-date">{formatDate(status.date)}</div>
                                                        <div className="timeline-status">
                                                            Status changed to: <strong>{status.status.charAt(0).toUpperCase() + status.status.slice(1)}</strong>
                                                        </div>
                                                        {status.comment && (
                                                            <div className="timeline-comment">{status.comment}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No status history available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .filters-container {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }
                
                .date-filters {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    align-items: flex-end;
                }
                
                .filter-group {
                    flex: 1;
                    min-width: 180px;
                    display: flex;
                    flex-direction: column;
                }
                
                .filter-group label {
                    margin-bottom: 0.25rem;
                    font-weight: 500;
                }
                
                .search-group {
                    flex: 2;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                
                .loading-spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top: 4px solid var(--color-primary);
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--color-text-secondary);
                }
                
                .empty-state i {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    color: var(--color-success);
                }
                
                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .issue-title {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .modal-lg {
                    max-width: 800px;
                }
                
                .resolution-details {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .section {
                    border-bottom: 1px solid var(--color-border);
                    padding-bottom: 1.5rem;
                }
                
                .section:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }
                
                .section h4 {
                    margin-bottom: 1rem;
                    color: var(--color-primary);
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                
                .info-item label {
                    font-weight: 600;
                    color: var(--color-text-secondary);
                    font-size: 0.875rem;
                }
                
                .resolution-description {
                    background-color: var(--color-bg-secondary);
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    border-left: 3px solid var(--color-success);
                }
                
                .resolution-images {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .resolution-image {
                    height: 150px;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    box-shadow: var(--shadow-sm);
                }
                
                .resolution-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .status-timeline {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    position: relative;
                    padding-left: 2rem;
                }
                
                .status-timeline::before {
                    content: '';
                    position: absolute;
                    left: 0.4rem;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background-color: var(--color-border);
                }
                
                .timeline-item {
                    position: relative;
                }
                
                .timeline-marker {
                    position: absolute;
                    left: -2rem;
                    top: 0.25rem;
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                    background-color: var(--color-primary);
                    z-index: 1;
                }
                
                .timeline-content {
                    background-color: var(--color-bg-secondary);
                    padding: 0.75rem;
                    border-radius: var(--border-radius);
                }
                
                .timeline-date {
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                    margin-bottom: 0.25rem;
                }
                
                .timeline-status {
                    font-weight: 500;
                }
                
                .timeline-comment {
                    margin-top: 0.5rem;
                    padding-top: 0.5rem;
                    border-top: 1px solid var(--color-border-light);
                    font-style: italic;
                    color: var(--color-text-secondary);
                }
                
                .badge-high {
                    background-color: #f97316;
                    color: white;
                }
                
                .badge-medium {
                    background-color: var(--color-warning);
                    color: white;
                }
                
                .badge-low {
                    background-color: var(--color-text-tertiary);
                    color: white;
                }
                
                .badge-urgent {
                    background-color: var(--color-danger);
                    color: white;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default ResolvedIssues;
