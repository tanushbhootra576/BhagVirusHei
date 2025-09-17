// Cookie utility functions for secure token storage

export const setCookie = (name, value, days = 7) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/; SameSite=Strict`;
};

export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (const c of cookies) {
        const cookie = c.trim();
        if (cookie.startsWith(`${name}=`)) return cookie.slice(name.length + 1);
    }
    return null;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Token manager for handling JWT authentication tokens
const tokenManager = {
    setToken: (token) => setCookie('auth_token', token, 7),
    getToken: () => getCookie('auth_token'),
    removeToken: () => deleteCookie('auth_token'),
};

export default tokenManager;
