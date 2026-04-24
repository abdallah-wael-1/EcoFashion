import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'ecofashion-theme';

/**
 * Initialize theme from:
 * 1. localStorage
 * 2. System preference (prefers-color-scheme)
 * 3. Default to 'light'
 */
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  // Check localStorage first
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    console.log('[ThemeContext] Loaded theme from localStorage:', saved);
    return saved;
  }

  // Fallback to system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = prefersDark ? 'dark' : 'light';
  console.log('[ThemeContext] Using system theme preference:', systemTheme);
  return systemTheme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to document root whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    console.log('[ThemeContext] Theme changed to:', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('[ThemeContext] Added "dark" class to <html>');
    } else {
      root.classList.remove('dark');
      console.log('[ThemeContext] Removed "dark" class from <html>');
    }

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
    console.log('[ThemeContext] Saved theme to localStorage:', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('[ThemeToggle] Toggle clicked, switching theme');
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('[ThemeToggle] New theme:', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};
