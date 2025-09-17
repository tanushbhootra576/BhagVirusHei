import api from './api';

export const getMe = () => api.get('/auth/me').then(r => r.data);
export const updateProfileApi = (payload) => api.put('/auth/profile', payload).then(r => r.data);
export const changePasswordApi = (payload) => api.put('/auth/change-password', payload).then(r => r.data);
