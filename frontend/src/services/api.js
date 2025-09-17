import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    try {
        console.log('[api] REQUEST', config.method?.toUpperCase(), config.url, 'params:', config.params || {}, 'data:', config.data ? '[body present]' : undefined);
    } catch {}
    return config;
});

api.interceptors.response.use(
    (response) => {
        try {
            console.log('[api] RESPONSE', response.status, response.config?.method?.toUpperCase(), response.config?.url);
        } catch {}
        return response;
    },
    (error) => {
        if (error.response) {
            console.warn('[api] ERROR RESPONSE', error.response.status, error.config?.method?.toUpperCase(), error.config?.url, 'message:', error.response.data?.message);
        } else if (error.request) {
            console.warn('[api] NO RESPONSE', error.config?.method?.toUpperCase(), error.config?.url);
        } else {
            console.warn('[api] REQUEST SETUP ERROR', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
