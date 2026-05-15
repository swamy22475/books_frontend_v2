import React, { createContext, useContext, useState, useCallback } from 'react';

const _noop = () => {};
const _defaultCtx = {
    printHeader: null, printFooter: null, logo: null,
    setPrintHeader: _noop, setPrintFooter: _noop, setLogo: _noop,
};
const SettingsContext = createContext(_defaultCtx);

const STORAGE_KEYS = {
    printHeader: 'settings_print_header',
    printFooter: 'settings_print_footer',
    logo: 'settings_logo',
};

const readFromStorage = (key) => {
    try {
        return localStorage.getItem(key) || null;
    } catch {
        return null;
    }
};

const saveToStorage = (key, value) => {
    try {
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    } catch {
        // quota exceeded – silently ignore
    }
};

export const SettingsProvider = ({ children }) => {
    const [printHeader, setPrintHeaderState] = useState(() => readFromStorage(STORAGE_KEYS.printHeader));
    const [printFooter, setPrintFooterState] = useState(() => readFromStorage(STORAGE_KEYS.printFooter));
    const [logo, setLogoState] = useState(() => readFromStorage(STORAGE_KEYS.logo));

    const setPrintHeader = useCallback((dataUrl) => {
        saveToStorage(STORAGE_KEYS.printHeader, dataUrl);
        setPrintHeaderState(dataUrl);
    }, []);

    const setPrintFooter = useCallback((dataUrl) => {
        saveToStorage(STORAGE_KEYS.printFooter, dataUrl);
        setPrintFooterState(dataUrl);
    }, []);

    const setLogo = useCallback((dataUrl) => {
        saveToStorage(STORAGE_KEYS.logo, dataUrl);
        setLogoState(dataUrl);
    }, []);

    return (
        <SettingsContext.Provider value={{
            printHeader,
            printFooter,
            logo,
            setPrintHeader,
            setPrintFooter,
            setLogo,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    return useContext(SettingsContext);
};

export default SettingsContext;
