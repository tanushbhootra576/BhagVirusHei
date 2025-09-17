import axios from 'axios';
import mockData from '../utils/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true; // Default to mock data for development

// Helper to handle API errors
const handleApiError = (error) => {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred. Please try again.';

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your internet connection.';
    }

    return { success: false, error: errorMessage };
};

// Get overall dashboard analytics
export const getDashboardAnalytics = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/dashboard`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get issue count by status
export const getIssueCountByStatus = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.issueCounts
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/issues/count-by-status`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get issue count by category
export const getIssueCountByCategory = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.categoryDistribution
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/issues/count-by-category`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get monthly trend data
export const getMonthlyTrends = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.monthlyTrends
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/issues/monthly-trends`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get analytics dashboard data
export const getAnalyticsDashboard = async (timeframe = 'month', department = 'all') => {
    if (USE_MOCK) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Use mock data based on timeframe and department
            const data = mockData.analytics.dashboardData;

            // Filter data by department if needed
            let filteredData = { ...data };
            if (department !== 'all') {
                // In a real app, this would be done on the server
                // Just returning the same data for demonstration
                filteredData = {
                    ...data,
                    departmentPerformance: data.departmentPerformance.filter(
                        dept => dept.id === department
                    )
                };
            }

            // Adjust data based on timeframe
            // In a real app, this would be done on the server
            switch (timeframe) {
                case 'week':
                    filteredData.issueTrend.labels = mockData.analytics.weeklyLabels;
                    filteredData.issueTrend.reported = mockData.analytics.weeklyReported;
                    filteredData.issueTrend.resolved = mockData.analytics.weeklyResolved;
                    break;
                case 'year':
                    filteredData.issueTrend.labels = mockData.analytics.yearlyLabels;
                    filteredData.issueTrend.reported = mockData.analytics.yearlyReported;
                    filteredData.issueTrend.resolved = mockData.analytics.yearlyResolved;
                    break;
                default:
                    // Month is default
                    filteredData.issueTrend.labels = mockData.analytics.monthlyLabels;
                    filteredData.issueTrend.reported = mockData.analytics.monthlyReported;
                    filteredData.issueTrend.resolved = mockData.analytics.monthlyResolved;
            }

            // Calculate max value for graph scaling
            filteredData.issueTrend.maxValue = Math.max(
                ...filteredData.issueTrend.reported,
                ...filteredData.issueTrend.resolved
            );

            return {
                success: true,
                data: filteredData
            };
        } catch (error) {
            console.error('Error fetching analytics dashboard:', error);
            return {
                success: false,
                error: 'Failed to load analytics data. Please try again later.'
            };
        }
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/dashboard`, {
            params: { timeframe, department }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get resolution time statistics
export const getResolutionTimeStats = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.resolutionTimes
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/issues/resolution-times`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get geographical distribution of issues
export const getGeographicalDistribution = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.geographicalDistribution
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/issues/geographical`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get citizen engagement statistics
export const getCitizenEngagement = async () => {
    if (USE_MOCK) {
        return {
            success: true,
            data: mockData.analytics.citizenEngagement
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/citizen-engagement`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get department performance statistics
export const getDepartmentPerformance = async () => {
    if (USE_MOCK) {
        // Generate mock department performance data
        const departmentPerformance = mockData.departments.map(dept => ({
            department: dept.value,
            issuesAssigned: Math.floor(Math.random() * 50) + 10,
            issuesResolved: Math.floor(Math.random() * 40) + 5,
            averageResolutionTime: (Math.random() * 5 + 1).toFixed(1),
            citizenSatisfaction: (Math.random() * 2 + 3).toFixed(1) // 3-5 rating
        }));

        return {
            success: true,
            data: departmentPerformance
        };
    }

    try {
        const response = await axios.get(`${API_URL}/analytics/department-performance`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get data for custom date range
export const getCustomRangeData = async (startDate, endDate) => {
    if (USE_MOCK) {
        // For mock data, just return the regular data
        return {
            success: true,
            data: {
                issueCounts: mockData.analytics.issueCounts,
                categoryDistribution: mockData.analytics.categoryDistribution,
                dateRange: {
                    start: startDate,
                    end: endDate
                }
            }
        };
    }

    try {
        const response = await axios.get(
            `${API_URL}/analytics/custom-range?startDate=${startDate}&endDate=${endDate}`
        );
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

export default {
    getDashboardAnalytics,
    getIssueCountByStatus,
    getIssueCountByCategory,
    getMonthlyTrends,
    getResolutionTimeStats,
    getGeographicalDistribution,
    getCitizenEngagement,
    getDepartmentPerformance,
    getCustomRangeData,
    getAnalyticsDashboard
}
