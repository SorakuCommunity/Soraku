"use client"
import { useEffect } from 'react';

const ThemeManager = () => {
  
    useEffect(() => {
        // Check for the presence of a saved theme in the cookie when the component mounts
        const savedTheme = getCookie("selectedTheme");
        if (savedTheme) {
          // Apply the saved theme to the site's CSS
          applyTheme(savedTheme);
        }
      }, []);
    
    
  return null; // This component does not render anything
};

const applyTheme = (theme) => {
    const root = document.documentElement;
    const themes = {
      default: {
        textPrimary: '#ffffff',
        bgPrimary: '#000000',
        bgSecondary: '#1a1a1a',
      },
      st: {
        textPrimary: '#F0C335',
        bgPrimary: '#10151E',
        bgSecondary: '#1a202c',
      },
      purple: {
        textPrimary: '#8e50cc',
        bgPrimary: '#14101E',
        bgSecondary: '#1e1629',
      },
      ocean: {
        textPrimary: '#4FB0C6',
        bgPrimary: '#0A192F',
        bgSecondary: '#172A45',
      },
      forest: {
        textPrimary: '#4CAF50',
        bgPrimary: '#1B2A21',
        bgSecondary: '#2C3E2E',
      },
      sunset: {
        textPrimary: '#FF7043',
        bgPrimary: '#2B1B17',
        bgSecondary: '#3D2B24',
      },
      cyberpunk: {
        textPrimary: '#00FF9F',
        bgPrimary: '#120458',
        bgSecondary: '#1B0C74',
      },
      dark: {
        textPrimary: '#ffffff',
        bgPrimary: '#121212',
        bgSecondary: '#1e1e1e',
      },
      al: {
        textPrimary: '#000000',
        bgPrimary: '#0b1622',
        bgSecondary: '#151f2e',
      },
      retro: {
        textPrimary: '#ffcc00',
        bgPrimary: '#000000',
        bgSecondary: '#ff6699',
      },
      aw: {
        textPrimary: '#ffcc00',
        bgPrimary: '#0e0e0e',
        bgSecondary: '#5a2e98',
      },
      ka: {
        textPrimary: '#ffcc00',
        bgPrimary: '#111213',
        bgSecondary: '#4d820f',
      },
      anp: {
        textPrimary: '#ffcc00',
        bgPrimary: '#131415',
        bgSecondary: '#253e53',
      },
    };

    const selectedTheme = themes[theme] || themes.default;

    root.style.setProperty('--text-primary', selectedTheme.textPrimary);
    root.style.setProperty('--bg-primary', selectedTheme.bgPrimary);
    root.style.setProperty('--bg-secondary', selectedTheme.bgSecondary);
    
  };

export default ThemeManager;

const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  };  
  