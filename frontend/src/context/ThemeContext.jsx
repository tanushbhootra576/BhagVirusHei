import React, { createContext, useState, useEffect, useCallback } from 'react';

// Central Theme Context (light/dark + system)
// Provides: theme (light|dark), setTheme(next), toggleTheme(), isDark, isLight
// Persists explicit user choice in localStorage under 'theme'. If 'system', will track system preference changes.
const ThemeContext = createContext();

const THEME_KEY = 'theme'; // values: 'light' | 'dark' | 'system'

const getSystemPreference = () => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
    const stored = localStorage.getItem(THEME_KEY) || 'light';
    const [userPreference, setUserPreference] = useState(stored); // what user picked (may be 'system')
    const [theme, setThemeState] = useState(stored === 'system' ? getSystemPreference() : stored);

    // Apply theme to <html> for highest specificity and allow body-level overrides
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Handle system preference change if user selected 'system'
    useEffect(() => {
        if (userPreference !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => setThemeState(mq.matches ? 'dark' : 'light');
        try { mq.addEventListener('change', handler); } catch { mq.addListener(handler); }
        return () => { try { mq.removeEventListener('change', handler); } catch { mq.removeListener(handler); } };
    }, [userPreference]);

    // Persist preference (not the resolved theme) when user selects
    const applyPreference = useCallback((pref) => {
        setUserPreference(pref);
        localStorage.setItem(THEME_KEY, pref);
        if (pref === 'system') {
            setThemeState(getSystemPreference());
        } else {
            setThemeState(pref);
        }
    }, []);

    // Backward compatible toggle (just flips between light/dark and overrides system)
    const toggleTheme = useCallback(() => {
        applyPreference(theme === 'light' ? 'dark' : 'light');
    }, [theme, applyPreference]);

    return (
        <ThemeContext.Provider
            value={{
                theme,              // resolved theme actually in use
                rawPreference: userPreference, // original stored preference (includes 'system')
                setTheme: applyPreference,
                toggleTheme,
                isDark: theme === 'dark',
                isLight: theme === 'light'
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
