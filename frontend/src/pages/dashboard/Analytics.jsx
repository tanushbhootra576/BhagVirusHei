import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { getAnalyticsDashboard } from '../../services/analytics';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('month'); // week, month, year
    const [department, setDepartment] = useState('all');

    useEffect(() => {
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeframe, department]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await getAnalyticsDashboard(timeframe, department);
            if (response.success) {
                setData(response.data);
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError('Failed to fetch analytics data. Please try again later.');
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    // Used for formatting percent changes in analytics data
    // eslint-disable-next-line no-unused-vars
    const calculatePercentChange = (current, previous) => {
        if (!previous) return { value: 0, isPositive: true };
        const change = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive: change >= 0
        };
    };

    const getTimeframeLabel = () => {
        switch (timeframe) {
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            case 'year':
                return 'This Year';
            default:
                return 'This Month';
        }
    };

    return (
        <DashboardLayout>
            <div className="card">
                <div className="card-header">
                    <h2>Analytics Dashboard</h2>
                    <div className="header-actions">
                        <div className="timeframe-selector">
                            <button
                                className={`btn ${timeframe === 'week' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setTimeframe('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`btn ${timeframe === 'month' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setTimeframe('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`btn ${timeframe === 'year' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setTimeframe('year')}
                            >
                                Year
                            </button>
                        </div>
                        <select
                            className="form-control"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="all">All Departments</option>
                            <option value="roads">Roads & Infrastructure</option>
                            <option value="water">Water Supply</option>
                            <option value="sanitation">Sanitation</option>
                            <option value="electricity">Electricity</option>
                            <option value="transport">Public Transport</option>
                            <option value="environment">Environment</option>
                        </select>
                    </div>
                </div>

                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading analytics data...</p>
                        </div>
                    ) : data ? (
                        <div className="analytics-dashboard">
                            <div className="stats-grid">
                                {/* Total Issues */}
                                <div className="stat-card">
                                    <div className="stat-icon">
                                        <i className="fas fa-clipboard-list"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>Total Issues</h3>
                                        <div className="stat-value">{formatNumber(data.totalIssues.current)}</div>
                                        <div className={`stat-change ${data.totalIssues.percentChange.isPositive ? 'positive' : 'negative'}`}>
                                            <i className={`fas fa-arrow-${data.totalIssues.percentChange.isPositive ? 'up' : 'down'}`}></i>
                                            {data.totalIssues.percentChange.value}% from previous {timeframe}
                                        </div>
                                    </div>
                                </div>

                                {/* Resolved Issues */}
                                <div className="stat-card">
                                    <div className="stat-icon success">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>Resolved Issues</h3>
                                        <div className="stat-value">{formatNumber(data.resolvedIssues.current)}</div>
                                        <div className={`stat-change ${data.resolvedIssues.percentChange.isPositive ? 'positive' : 'negative'}`}>
                                            <i className={`fas fa-arrow-${data.resolvedIssues.percentChange.isPositive ? 'up' : 'down'}`}></i>
                                            {data.resolvedIssues.percentChange.value}% from previous {timeframe}
                                        </div>
                                    </div>
                                </div>

                                {/* Resolution Rate */}
                                <div className="stat-card">
                                    <div className="stat-icon warning">
                                        <i className="fas fa-percentage"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>Resolution Rate</h3>
                                        <div className="stat-value">{data.resolutionRate.current}%</div>
                                        <div className={`stat-change ${data.resolutionRate.percentChange.isPositive ? 'positive' : 'negative'}`}>
                                            <i className={`fas fa-arrow-${data.resolutionRate.percentChange.isPositive ? 'up' : 'down'}`}></i>
                                            {data.resolutionRate.percentChange.value}% from previous {timeframe}
                                        </div>
                                    </div>
                                </div>

                                {/* Average Resolution Time */}
                                <div className="stat-card">
                                    <div className="stat-icon info">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="stat-content">
                                        <h3>Avg. Resolution Time</h3>
                                        <div className="stat-value">{data.avgResolutionTime.current} days</div>
                                        <div className={`stat-change ${!data.avgResolutionTime.percentChange.isPositive ? 'positive' : 'negative'}`}>
                                            <i className={`fas fa-arrow-${!data.avgResolutionTime.percentChange.isPositive ? 'down' : 'up'}`}></i>
                                            {data.avgResolutionTime.percentChange.value}% from previous {timeframe}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="charts-grid">
                                {/* Issues by Category */}
                                <div className="chart-card">
                                    <h3>Issues by Category</h3>
                                    <div className="category-chart">
                                        {data.issuesByCategory.map((category, index) => (
                                            <div key={index} className="category-item">
                                                <div className="category-label">
                                                    <span className="color-dot" style={{ backgroundColor: category.color }}></span>
                                                    {category.name}
                                                </div>
                                                <div className="category-bar-container">
                                                    <div
                                                        className="category-bar"
                                                        style={{
                                                            width: `${category.percentage}%`,
                                                            backgroundColor: category.color
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="category-count">
                                                    {category.count} <span className="category-percent">({category.percentage}%)</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Trend Chart */}
                                <div className="chart-card">
                                    <h3>Issue Trends - {getTimeframeLabel()}</h3>
                                    <div className="trend-chart">
                                        <div className="trend-legend">
                                            <div className="legend-item">
                                                <span className="legend-color" style={{ backgroundColor: '#4338CA' }}></span>
                                                <span>Reported</span>
                                            </div>
                                            <div className="legend-item">
                                                <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
                                                <span>Resolved</span>
                                            </div>
                                        </div>
                                        <div className="trend-graph">
                                            {data.issueTrend.labels.map((label, index) => (
                                                <div key={index} className="trend-column">
                                                    <div className="trend-bars">
                                                        <div
                                                            className="trend-bar reported"
                                                            style={{ height: `${(data.issueTrend.reported[index] / data.issueTrend.maxValue) * 100}%` }}
                                                        >
                                                            <span className="trend-tooltip">{data.issueTrend.reported[index]}</span>
                                                        </div>
                                                        <div
                                                            className="trend-bar resolved"
                                                            style={{ height: `${(data.issueTrend.resolved[index] / data.issueTrend.maxValue) * 100}%` }}
                                                        >
                                                            <span className="trend-tooltip">{data.issueTrend.resolved[index]}</span>
                                                        </div>
                                                    </div>
                                                    <div className="trend-label">{label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Department Performance */}
                                <div className="chart-card">
                                    <h3>Department Performance</h3>
                                    <div className="department-performance">
                                        <table className="performance-table">
                                            <thead>
                                                <tr>
                                                    <th>Department</th>
                                                    <th>Issues</th>
                                                    <th>Resolved</th>
                                                    <th>Avg Time</th>
                                                    <th>Performance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.departmentPerformance.map((dept, index) => (
                                                    <tr key={index}>
                                                        <td>{dept.name}</td>
                                                        <td>{dept.totalIssues}</td>
                                                        <td>{dept.resolvedIssues}</td>
                                                        <td>{dept.avgResolutionTime} days</td>
                                                        <td>
                                                            <div className="performance-meter">
                                                                <div
                                                                    className={`performance-bar ${dept.performanceScore >= 80 ? 'excellent' :
                                                                            dept.performanceScore >= 60 ? 'good' :
                                                                                dept.performanceScore >= 40 ? 'average' : 'poor'
                                                                        }`}
                                                                    style={{ width: `${dept.performanceScore}%` }}
                                                                ></div>
                                                                <span className="performance-score">{dept.performanceScore}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* User Satisfaction */}
                                <div className="chart-card">
                                    <h3>Citizen Satisfaction</h3>
                                    <div className="satisfaction-container">
                                        <div className="satisfaction-meter">
                                            <div className="satisfaction-gauge">
                                                <div
                                                    className="satisfaction-level"
                                                    style={{
                                                        transform: `rotate(${(data.citizenSatisfaction / 100) * 180}deg)`
                                                    }}
                                                ></div>
                                                <div className="satisfaction-value">
                                                    {data.citizenSatisfaction}%
                                                </div>
                                            </div>
                                            <div className="satisfaction-labels">
                                                <span>Poor</span>
                                                <span>Average</span>
                                                <span>Excellent</span>
                                            </div>
                                        </div>
                                        <div className="satisfaction-breakdown">
                                            <div className="satisfaction-rating">
                                                <span className="rating-label">Very Satisfied:</span>
                                                <div className="rating-bar-container">
                                                    <div
                                                        className="rating-bar excellent"
                                                        style={{ width: `${data.satisfactionBreakdown.verySatisfied}%` }}
                                                    ></div>
                                                </div>
                                                <span className="rating-value">{data.satisfactionBreakdown.verySatisfied}%</span>
                                            </div>
                                            <div className="satisfaction-rating">
                                                <span className="rating-label">Satisfied:</span>
                                                <div className="rating-bar-container">
                                                    <div
                                                        className="rating-bar good"
                                                        style={{ width: `${data.satisfactionBreakdown.satisfied}%` }}
                                                    ></div>
                                                </div>
                                                <span className="rating-value">{data.satisfactionBreakdown.satisfied}%</span>
                                            </div>
                                            <div className="satisfaction-rating">
                                                <span className="rating-label">Neutral:</span>
                                                <div className="rating-bar-container">
                                                    <div
                                                        className="rating-bar average"
                                                        style={{ width: `${data.satisfactionBreakdown.neutral}%` }}
                                                    ></div>
                                                </div>
                                                <span className="rating-value">{data.satisfactionBreakdown.neutral}%</span>
                                            </div>
                                            <div className="satisfaction-rating">
                                                <span className="rating-label">Dissatisfied:</span>
                                                <div className="rating-bar-container">
                                                    <div
                                                        className="rating-bar poor"
                                                        style={{ width: `${data.satisfactionBreakdown.dissatisfied}%` }}
                                                    ></div>
                                                </div>
                                                <span className="rating-value">{data.satisfactionBreakdown.dissatisfied}%</span>
                                            </div>
                                            <div className="satisfaction-rating">
                                                <span className="rating-label">Very Dissatisfied:</span>
                                                <div className="rating-bar-container">
                                                    <div
                                                        className="rating-bar very-poor"
                                                        style={{ width: `${data.satisfactionBreakdown.veryDissatisfied}%` }}
                                                    ></div>
                                                </div>
                                                <span className="rating-value">{data.satisfactionBreakdown.veryDissatisfied}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-chart-bar"></i>
                            <h3>No Analytics Data Available</h3>
                            <p>There is no analytics data available for the selected timeframe and department.</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .header-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                
                .timeframe-selector {
                    display: flex;
                    gap: 0.25rem;
                }
                
                .timeframe-selector .btn {
                    font-size: 0.875rem;
                    padding: 0.375rem 0.75rem;
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
                
                .analytics-dashboard {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.5rem;
                }
                
                .stat-card {
                    background-color: var(--color-bg-secondary);
                    border-radius: var(--border-radius);
                    padding: 1.5rem;
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--color-border);
                }
                
                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background-color: var(--color-primary-light);
                    color: var(--color-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                
                .stat-icon.success {
                    background-color: var(--color-success-light);
                    color: var(--color-success);
                }
                
                .stat-icon.warning {
                    background-color: var(--color-warning-light);
                    color: var(--color-warning);
                }
                
                .stat-icon.info {
                    background-color: var(--color-info-light);
                    color: var(--color-info);
                }
                
                .stat-content {
                    flex: 1;
                }
                
                .stat-content h3 {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--color-text-secondary);
                    margin-bottom: 0.5rem;
                }
                
                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                
                .stat-change {
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: var(--color-text-secondary);
                }
                
                .stat-change.positive {
                    color: var(--color-success);
                }
                
                .stat-change.negative {
                    color: var(--color-danger);
                }
                
                .charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                    gap: 1.5rem;
                }
                
                .chart-card {
                    background-color: var(--color-bg-secondary);
                    border-radius: var(--border-radius);
                    padding: 1.5rem;
                    border: 1px solid var(--color-border);
                    box-shadow: var(--shadow-sm);
                }
                
                .chart-card h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: var(--color-primary);
                    border-bottom: 1px solid var(--color-border-light);
                    padding-bottom: 0.5rem;
                }
                
                /* Category Chart Styles */
                .category-chart {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .category-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .category-label {
                    width: 25%;
                    font-size: 0.875rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .color-dot {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }
                
                .category-bar-container {
                    flex: 1;
                    height: 12px;
                    background-color: var(--color-bg-primary);
                    border-radius: 6px;
                    overflow: hidden;
                }
                
                .category-bar {
                    height: 100%;
                    border-radius: 6px;
                }
                
                .category-count {
                    width: 15%;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-align: right;
                }
                
                .category-percent {
                    color: var(--color-text-secondary);
                    font-weight: normal;
                }
                
                /* Trend Chart Styles */
                .trend-legend {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                }
                
                .legend-color {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                }
                
                .trend-graph {
                    height: 200px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    padding-top: 1.5rem;
                    position: relative;
                }
                
                .trend-column {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                }
                
                .trend-bars {
                    width: 100%;
                    height: 85%;
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                    align-items: flex-end;
                }
                
                .trend-bar {
                    position: relative;
                    width: 16px;
                    border-radius: 3px 3px 0 0;
                    transition: height 0.3s ease;
                }
                
                .trend-bar.reported {
                    background-color: #4338CA;
                }
                
                .trend-bar.resolved {
                    background-color: #10B981;
                }
                
                .trend-tooltip {
                    position: absolute;
                    top: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--color-text-primary);
                    color: var(--color-bg-primary);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    white-space: nowrap;
                }
                
                .trend-bar:hover .trend-tooltip {
                    opacity: 1;
                }
                
                .trend-label {
                    margin-top: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--color-text-secondary);
                }
                
                /* Department Performance Styles */
                .performance-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .performance-table th,
                .performance-table td {
                    padding: 0.75rem 0.5rem;
                    text-align: left;
                    font-size: 0.875rem;
                    border-bottom: 1px solid var(--color-border-light);
                }
                
                .performance-table th {
                    font-weight: 500;
                    color: var(--color-text-secondary);
                }
                
                .performance-meter {
                    width: 100%;
                    height: 8px;
                    background-color: var(--color-bg-primary);
                    border-radius: 4px;
                    overflow: hidden;
                    position: relative;
                }
                
                .performance-bar {
                    height: 100%;
                    border-radius: 4px;
                }
                
                .performance-bar.excellent {
                    background-color: var(--color-success);
                }
                
                .performance-bar.good {
                    background-color: var(--color-info);
                }
                
                .performance-bar.average {
                    background-color: var(--color-warning);
                }
                
                .performance-bar.poor {
                    background-color: var(--color-danger);
                }
                
                .performance-score {
                    position: absolute;
                    right: 0;
                    top: -18px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                /* Satisfaction Styles */
                .satisfaction-container {
                    display: flex;
                    gap: 2rem;
                }
                
                .satisfaction-meter {
                    width: 180px;
                }
                
                .satisfaction-gauge {
                    width: 180px;
                    height: 90px;
                    background-color: var(--color-bg-primary);
                    border-radius: 90px 90px 0 0;
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                
                .satisfaction-level {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform-origin: bottom center;
                    background: conic-gradient(
                        #EF4444 0deg 36deg,
                        #F97316 36deg 72deg,
                        #FBBF24 72deg 108deg,
                        #22C55E 108deg 144deg,
                        #10B981 144deg 180deg
                    );
                    clip-path: polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
                    transform: rotate(0deg);
                    transition: transform 1s ease;
                }
                
                .satisfaction-value {
                    position: absolute;
                    bottom: 10px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    background-color: var(--color-bg-secondary);
                    padding: 0.25rem 0.75rem;
                    border-radius: 12px;
                    box-shadow: var(--shadow-sm);
                }
                
                .satisfaction-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.75rem;
                    color: var(--color-text-secondary);
                }
                
                .satisfaction-breakdown {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .satisfaction-rating {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .rating-label {
                    width: 120px;
                    font-size: 0.875rem;
                    text-align: right;
                }
                
                .rating-bar-container {
                    flex: 1;
                    height: 12px;
                    background-color: var(--color-bg-primary);
                    border-radius: 6px;
                    overflow: hidden;
                }
                
                .rating-bar {
                    height: 100%;
                    border-radius: 6px;
                }
                
                .rating-bar.excellent {
                    background-color: #10B981;
                }
                
                .rating-bar.good {
                    background-color: #22C55E;
                }
                
                .rating-bar.average {
                    background-color: #FBBF24;
                }
                
                .rating-bar.poor {
                    background-color: #F97316;
                }
                
                .rating-bar.very-poor {
                    background-color: #EF4444;
                }
                
                .rating-value {
                    width: 40px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                @media (max-width: 768px) {
                    .charts-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .satisfaction-container {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .category-label {
                        width: 30%;
                    }
                    
                    .category-count {
                        width: 20%;
                    }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default Analytics;
