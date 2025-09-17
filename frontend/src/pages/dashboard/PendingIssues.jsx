import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { getPendingIssues, assignIssue, updateIssueStatus, deleteIssue } from '../../services/issues';
import mockData from '../../utils/mockData';
import '../../styles/pendingIssues.css';

const PendingIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        department: '',
        officialId: '',
        comment: '',
        resolutionDetails: {
            description: ''
        }
    });
    const [filterPriority, setFilterPriority] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPendingIssues();
    }, []);

    const fetchPendingIssues = async () => {
        setLoading(true);
        try {
            const response = await getPendingIssues();
            if (response.success) {
                setIssues(response.data);
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error fetching pending issues:', error);
            setError('Failed to fetch pending issues. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleAssign = async () => {
        if (!formData.department) {
            return;
        }

        try {
            const response = await assignIssue(selectedIssue.id, {
                department: formData.department,
                officialId: formData.officialId || null,
                comment: formData.comment
            });

            if (response.success) {
                // Update the local state to reflect changes
                setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
                setShowAssignModal(false);
                setSelectedIssue(null);
                // Show success message
                alert('Issue assigned successfully!');
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error assigning issue:', error);
            setError('Failed to assign issue. Please try again.');
        }
    };

    const handleResolve = async () => {
        if (!formData.resolutionDetails.description) {
            return;
        }

        try {
            const response = await updateIssueStatus(selectedIssue.id, {
                status: 'resolved',
                comment: formData.comment,
                resolutionDetails: {
                    description: formData.resolutionDetails.description
                }
            });

            if (response.success) {
                // Update the local state to reflect changes
                setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
                setShowResolveModal(false);
                setSelectedIssue(null);
                // Show success message
                alert('Issue marked as resolved successfully!');
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error resolving issue:', error);
            setError('Failed to resolve issue. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await deleteIssue(selectedIssue.id);

            if (response.success) {
                // Update the local state to reflect changes
                setIssues(issues.filter(issue => issue.id !== selectedIssue.id));
                setShowDeleteModal(false);
                setSelectedIssue(null);
                // Show success message
                alert('Issue deleted successfully!');
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            setError('Failed to delete issue. Please try again.');
        }
    };

    const openAssignModal = (issue) => {
        setSelectedIssue(issue);
        setFormData({
            department: issue.department || '',
            officialId: '',
            comment: '',
            resolutionDetails: {
                description: ''
            }
        });
        setShowAssignModal(true);
    };

    const openResolveModal = (issue) => {
        setSelectedIssue(issue);
        setFormData({
            department: issue.department || '',
            officialId: '',
            comment: '',
            resolutionDetails: {
                description: ''
            }
        });
        setShowResolveModal(true);
    };

    const openDeleteModal = (issue) => {
        setSelectedIssue(issue);
        setShowDeleteModal(true);
    };

    const closeModals = () => {
        setShowAssignModal(false);
        setShowResolveModal(false);
        setShowDeleteModal(false);
        setSelectedIssue(null);
    };

    // Filter issues based on selected filters and search query
    const filteredIssues = (Array.isArray(issues) ? issues : []).filter(issue => {
        const matchesPriority = filterPriority ? issue.priority === filterPriority : true;
        const matchesCategory = filterCategory ? issue.category === filterCategory : true;
        const matchesSearch = searchQuery
            ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.reporter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesPriority && matchesCategory && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header">
                    <h2>Pending Issues</h2>
                    <div className="header-actions">
                        <button className="btn btn-outline" onClick={fetchPendingIssues}>
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
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                            >
                                <option value="">All Priorities</option>
                                {mockData.priorities.map(priority => (
                                    <option key={priority.value} value={priority.value}>
                                        {priority.label}
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

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading pending issues...</p>
                        </div>
                    ) : filteredIssues.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-check-circle"></i>
                            <h3>No Pending Issues</h3>
                            <p>There are no pending issues that match your filters.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Reporter</th>
                                        <th>Location</th>
                                        <th>Date</th>
                                        <th>Category</th>
                                        <th>Priority</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIssues.map(issue => (
                                        <tr key={issue.id}>
                                            <td>
                                                <div className="issue-title">
                                                    {issue.title}
                                                    {issue.votes > 0 && (
                                                        <span className="badge badge-accent">{issue.votes} votes</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>{issue.reporter?.name}</td>
                                            <td>{issue.location?.address}</td>
                                            <td>{issue.date}</td>
                                            <td>
                                                {mockData.categories.find(c => c.value === issue.category)?.label || issue.category}
                                            </td>
                                            <td>
                                                <span className={`priority priority-${issue.priority}`}>
                                                    {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-container">
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => openAssignModal(issue)}
                                                    >
                                                        Assign
                                                    </button>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => openResolveModal(issue)}
                                                    >
                                                        Resolve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => openDeleteModal(issue)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign Modal */}
            {showAssignModal && selectedIssue && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Assign Issue</h3>
                            <button className="modal-close" onClick={closeModals}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Issue Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedIssue.title}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    name="department"
                                    className="form-control"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {mockData.departments.map(dept => (
                                        <option key={dept.value} value={dept.value}>
                                            {dept.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assign to Official (Optional)</label>
                                <select
                                    name="officialId"
                                    className="form-control"
                                    value={formData.officialId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Official</option>
                                    {mockData.officials
                                        .filter(official => !formData.department || official.department === formData.department)
                                        .map(official => (
                                            <option key={official.id} value={official.id}>
                                                {official.name} - {official.position}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment (Optional)</label>
                                <textarea
                                    name="comment"
                                    className="form-control"
                                    rows="3"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Add any additional notes about this assignment"
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={closeModals}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleAssign}
                                disabled={!formData.department}
                            >
                                Assign Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {showResolveModal && selectedIssue && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Resolve Issue</h3>
                            <button className="modal-close" onClick={closeModals}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Issue Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedIssue.title}
                                    disabled
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Resolution Details</label>
                                <textarea
                                    name="resolutionDetails.description"
                                    className="form-control"
                                    rows="4"
                                    value={formData.resolutionDetails.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe how the issue was resolved"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Additional Comment (Optional)</label>
                                <textarea
                                    name="comment"
                                    className="form-control"
                                    rows="2"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Add any additional notes"
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={closeModals}>Cancel</button>
                            <button
                                className="btn btn-success"
                                onClick={handleResolve}
                                disabled={!formData.resolutionDetails.description}
                            >
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedIssue && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Delete Issue</h3>
                            <button className="modal-close" onClick={closeModals}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the following issue?</p>
                            <p><strong>{selectedIssue.title}</strong></p>
                            <p className="text-danger">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={closeModals}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete Issue
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </DashboardLayout>
    );
};

export default PendingIssues;
