import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check primary storage key first, then legacy key
        const saved = localStorage.getItem('vite-ui-theme') || localStorage.getItem('theme');
        return saved === 'dark';
    });

    useEffect(() => {
        // Apply theme to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark-theme', 'dark');
            document.documentElement.classList.remove('light-theme', 'light');
        } else {
            document.documentElement.classList.add('light-theme', 'light');
            document.documentElement.classList.remove('dark-theme', 'dark');
        }
        // Save preference
        // keep both keys in sync for backwards compatibility
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('vite-ui-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
