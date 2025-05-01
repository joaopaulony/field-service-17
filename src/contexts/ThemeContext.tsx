
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = 'light' | 'dark' | 'tech';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light',
  setTheme: () => {} 
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', theme);
    
    // Update document class for Tailwind theme
    const root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme', 'tech-theme');
    root.classList.add(`${theme}-theme`);
    
    // Also add the data-theme attribute for shadcn components
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
