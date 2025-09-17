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

// Get all alerts
export const getAlerts = async () => {
    if (USE_MOCK) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            success: true,
            data: mockData.alerts
        };
    }

    try {
        const response = await axios.get(`${API_URL}/alerts`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get alert by ID
export const getAlertById = async (alertId) => {
    if (USE_MOCK) {
        const alert = mockData.alerts.find(alert => alert.id === alertId);
        return {
            success: !!alert,
            data: alert || null,
            error: !alert ? 'Alert not found' : null
        };
    }

    try {
        const response = await axios.get(`${API_URL}/alerts/${alertId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

// Create a new alert
export const createAlert = async (alertData) => {
    if (USE_MOCK) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newAlert = {
            id: `AL${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
            ...alertData,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isActive: true,
            createdBy: {
                id: 'GO101',
                name: 'Rajesh Kumar'
            }
        };

        return {
            success: true,
            message: 'Alert created successfully',
            data: newAlert
        };
    }

    try {
        const response = await axios.post(`${API_URL}/alerts`, alertData);
        return { success: true, data: response.data, message: 'Alert created successfully' };
    } catch (error) {
        return handleApiError(error);
    }
};

// Update an alert
export const updateAlert = async (alertId, alertData) => {
    if (USE_MOCK) {
        const alertIndex = mockData.alerts.findIndex(alert => alert.id === alertId);
        if (alertIndex === -1) {
            return { success: false, error: 'Alert not found' };
        }

        const updatedAlert = {
            ...mockData.alerts[alertIndex],
            ...alertData
        };

        return {
            success: true,
            message: 'Alert updated successfully',
            data: updatedAlert
        };
    }

    try {
        const response = await axios.put(`${API_URL}/alerts/${alertId}`, alertData);
        return { success: true, data: response.data, message: 'Alert updated successfully' };
    } catch (error) {
        return handleApiError(error);
    }
};

// Delete an alert
export const deleteAlert = async (alertId) => {
    if (USE_MOCK) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const alertIndex = mockData.alerts.findIndex(alert => alert.id === alertId);
        if (alertIndex === -1) {
            return { success: false, error: 'Alert not found' };
        }

        return {
            success: true,
            message: 'Alert deleted successfully'
        };
    }

    try {
        await axios.delete(`${API_URL}/alerts/${alertId}`);
        return { success: true, message: 'Alert deleted successfully' };
    } catch (error) {
        return handleApiError(error);
    }
};

// Toggle alert active status
export const toggleAlertStatus = async (alertId, isActive) => {
    if (USE_MOCK) {
        const alertIndex = mockData.alerts.findIndex(alert => alert.id === alertId);
        if (alertIndex === -1) {
            return { success: false, error: 'Alert not found' };
        }

        const updatedAlert = {
            ...mockData.alerts[alertIndex],
            isActive
        };

        return {
            success: true,
            message: `Alert ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedAlert
        };
    }

    try {
        const response = await axios.patch(`${API_URL}/alerts/${alertId}/status`, { isActive });
        return {
            success: true,
            data: response.data,
            message: `Alert ${isActive ? 'activated' : 'deactivated'} successfully`
        };
    } catch (error) {
        return handleApiError(error);
    }
};

// Get alerts for a specific area
export const getAlertsByArea = async (area) => {
    if (USE_MOCK) {
        const areaAlerts = mockData.alerts.filter(alert =>
            alert.isActive && (
                alert.affectedAreas.includes(area) ||
                alert.affectedAreas.includes('Entire City')
            )
        );

        return {
            success: true,
            data: areaAlerts
        };
    }

    try {
        const response = await axios.get(`${API_URL}/alerts/area/${area}`);
        return { success: true, data: response.data };
    } catch (error) {
        return handleApiError(error);
    }
};

export default {
    getAlerts,
    getAlertById,
    createAlert,
    updateAlert,
    deleteAlert,
    toggleAlertStatus,
    getAlertsByArea
};
