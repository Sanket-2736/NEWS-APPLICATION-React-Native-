import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

const lightColors = {
  background: '#ffffff',
  surface: '#f8f9fa',
  card: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#6b7280',
  primary: '#3b82f6',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
  shadow: '#000000',
};

const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  primary: '#60a5fa',
  border: '#475569',
  error: '#f87171',
  success: '#34d399',
  shadow: '#000000',
};

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isSystemMode, setIsSystemMode] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (isSystemMode) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      const savedIsSystem = await AsyncStorage.getItem('isSystemMode');
      
      if (savedIsSystem !== null) {
        const systemMode = JSON.parse(savedIsSystem);
        setIsSystemMode(systemMode);
        
        if (!systemMode && savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      setIsSystemMode(false);
      
      await AsyncStorage.setItem('themePreference', newDarkMode ? 'dark' : 'light');
      await AsyncStorage.setItem('isSystemMode', JSON.stringify(false));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const setSystemMode = async () => {
    try {
      setIsSystemMode(true);
      setIsDarkMode(systemColorScheme === 'dark');
      
      await AsyncStorage.setItem('isSystemMode', JSON.stringify(true));
    } catch (error) {
      console.error('Error setting system mode:', error);
    }
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const value = {
    isDarkMode,
    isSystemMode,
    colors,
    toggleTheme,
    setSystemMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}