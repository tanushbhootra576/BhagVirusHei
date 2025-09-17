import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { getAlerts, createAlert, deleteAlert } from '../../services/alerts';
import mockData from '../../utils/mockData';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        audience: 'all',
        areas: [],
        expiryDate: ''
    });
    const [filterType, setFilterType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const response = await getAlerts();
            if (response.success) {
                setAlerts(response.data);
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch alerts. Please try again later.');
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlert = async () => {
        try {
            if (!formData.title || !formData.message) {
                setError('Please fill in all required fields.');
                return;
            }

            const response = await createAlert(formData);
            if (response.success) {
                setAlerts([...alerts, response.data]);
                setShowCreateModal(false);
                resetForm();
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to create alert. Please try again.');
            console.error('Error creating alert:', err);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!selectedAlert) return;

            const response = await deleteAlert(selectedAlert.id);
            if (response.success) {
                setAlerts(alerts.filter(alert => alert.id !== selectedAlert.id));
                setShowDeleteModal(false);
                setSelectedAlert(null);
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to delete alert. Please try again.');
            console.error('Error deleting alert:', err);
        }
    };

    const openDeleteModal = (alert) => {
        setSelectedAlert(alert);
        setShowDeleteModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            message: '',
            type: 'info',
            audience: 'all',
            areas: [],
            expiryDate: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAreaSelection = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setFormData({ ...formData, areas: [...formData.areas, value] });
        } else {
            setFormData({
                ...formData,
                areas: formData.areas.filter(area => area !== value)
            });
        }
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

    // Filter alerts based on selected filters and search query
    const filteredAlerts = alerts.filter(alert => {
        const matchesType = filterType ? alert.type === filterType : true;

        const matchesSearch = searchQuery
            ? alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.message.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        return matchesType && matchesSearch;
    });

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header">
                    <h2>Manage Alerts</h2>
                    <div className="header-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <i className="fas fa-plus"></i> Create Alert
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
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">All Alert Types</option>
                                <option value="info">Information</option>
                                <option value="warning">Warning</option>
                                <option value="emergency">Emergency</option>
                                <option value="announcement">Announcement</option>
                            </select>
                        </div>

                        <div className="filter-group search-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search alerts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <button className="btn btn-outline" onClick={fetchAlerts}>
                                <i className="fas fa-sync"></i> Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading alerts...</p>
                        </div>
                    ) : filteredAlerts.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-bell-slash"></i>
                            <h3>No Alerts</h3>
                            <p>There are no alerts that match your filters. Create a new alert to get started.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Message</th>
                                        <th>Audience</th>
                                        <th>Created On</th>
                                        <th>Expires On</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAlerts.map(alert => (
                                        <tr key={alert.id}>
                                            <td>{alert.title}</td>
                                            <td>
                                                <span className={`badge badge-${alert.type}`}>
                                                    {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="truncate-text">{alert.message}</div>
                                            </td>
                                            <td>{alert.audience === 'all' ? 'All Citizens' : 'Selected Areas'}</td>
                                            <td>{formatDate(alert.date)}</td>
                                            <td>{formatDate(alert.expiryDate)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => openDeleteModal(alert)}
                                                >
                                                    <i className="fas fa-trash"></i>
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

            {/* Create Alert Modal */}
            {showCreateModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Create New Alert</h3>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Alert Type *</label>
                                <select
                                    id="type"
                                    name="type"
                                    className="form-control"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="info">Information</option>
                                    <option value="warning">Warning</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="announcement">Announcement</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="audience">Target Audience *</label>
                                <select
                                    id="audience"
                                    name="audience"
                                    className="form-control"
                                    value={formData.audience}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="all">All Citizens</option>
                                    <option value="selected">Selected Areas</option>
                                </select>
                            </div>

                            {formData.audience === 'selected' && (
                                <div className="form-group">
                                    <label>Select Areas</label>
                                    <div className="checkbox-group">
                                        {mockData.areas.map(area => (
                                            <div key={area.id} className="form-check">
                                                <input
                                                    type="checkbox"
                                                    id={`area-${area.id}`}
                                                    value={area.id}
                                                    checked={formData.areas.includes(area.id)}
                                                    onChange={handleAreaSelection}
                                                    className="form-check-input"
                                                />
                                                <label htmlFor={`area-${area.id}`} className="form-check-label">
                                                    {area.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date</label>
                                <input
                                    type="date"
                                    id="expiryDate"
                                    name="expiryDate"
                                    className="form-control"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                />
                                <small className="text-muted">Leave empty if the alert doesn't expire</small>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateAlert}
                            >
                                Create Alert
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedAlert && (
                <div className="modal-backdrop">
                    <div className="modal modal-sm">
                        <div className="modal-header">
                            <h3>Confirm Delete</h3>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedAlert(null);
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete the alert <strong>"{selectedAlert.title}"</strong>?</p>
                            <p className="text-danger">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedAlert(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .filters-container {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                
                .filter-group {
                    flex: 1;
                    min-width: 180px;
                }
                
                .search-group {
                    flex: 2;
                }
                
                .header-actions {
                    display: flex;
                    gap: 0.5rem;
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
                    color: var(--color-primary);
                }
                
                .badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                
                .badge-info {
                    background-color: var(--color-info);
                    color: white;
                }
                
                .badge-warning {
                    background-color: var(--color-warning);
                    color: white;
                }
                
                .badge-emergency {
                    background-color: var(--color-danger);
                    color: white;
                }
                
                .badge-announcement {
                    background-color: var(--color-primary);
                    color: white;
                }
                
                .truncate-text {
                    max-width: 250px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                
                .checkbox-group {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    padding: 0.75rem;
                    border: 1px solid var(--color-border);
                    border-radius: var(--border-radius);
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .form-check {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .form-check-input {
                    margin-top: 0;
                }
                
                .modal-sm {
                    max-width: 400px;
                }
                
                .text-danger {
                    color: var(--color-danger);
                }
                
                .text-muted {
                    color: var(--color-text-secondary);
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Alerts;
