import { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Prefer environment variable (e.g. VITE_API_URL) falling back to '/api'
const API_BASE_URL = import.meta?.env?.VITE_API_URL || '/api';

// Export the useAuth hook correctly
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let toast;
    try {
        toast = useToast();
    } catch {
        // Fallback no-op toast object if provider not yet mounted
        toast = { push: () => {} };
    }

    // Check for existing token on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token with backend
            // Use relative path so that when deployed behind a proxy it still works
            fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error('Invalid token');
                })
                .then(user => {
                    if (user && typeof user.role === 'string') {
                        const r = user.role.toLowerCase();
                        if (r === 'governement') user.role = 'government';
                    }
                    setCurrentUser(user);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        setError('');
        try {
            const requestBody = { email, password };
            console.log('Login request body:', requestBody);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user && typeof data.user.role === 'string') {
                    const r = data.user.role.toLowerCase();
                    if (r === 'governement') data.user.role = 'government';
                }
                setCurrentUser(data.user);
                toast.push(`Logged in as ${data.user.role}`, { type: 'success' });
                return data.user;
            } else {
                console.error('Login error response:', data);
                setError(data.message || 'Login failed');
                toast.push(data.message || 'Login failed', { type: 'error' });
                return null;
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
            return null;
        }
    };

    // Register new user
    const register = async (userData) => {
        setError('');
        try {
            console.log('Register request body:', userData);

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user && typeof data.user.role === 'string') {
                    const r = data.user.role.toLowerCase();
                    if (r === 'governement') data.user.role = 'government';
                }
                setCurrentUser(data.user);
                toast.push(`Registered & logged in as ${data.user.role}`, { type: 'success' });
                return data.user;
            } else {
                setError(data.message || 'Registration failed');
                toast.push(data.message || 'Registration failed', { type: 'error' });
                return null;
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please try again.');
            return null;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        navigate('/');
    };

    const value = {
        currentUser,
        user: currentUser, // Add this alias for ProtectedRoute
        isAuthenticated: !!currentUser, // Add this computed value
        loading, // Add this state value
        // Derived role convenience flags (used by Sidebar etc.)
    isGovernment: currentUser?.role === 'government' || currentUser?.role === 'governement',
    isCitizen: currentUser?.role === 'citizen',
        login,
        register,
        logout,
        error,
        setError,
        isFirebaseEnabled: false // Always false since we removed Firebase
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Make sure this default export is here
export default AuthContext;
