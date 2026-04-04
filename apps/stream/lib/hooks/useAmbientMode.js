import { useState, useEffect } from 'react';

export const useAmbientMode = () => {
  const [ambientMode, setAmbientMode] = useState(false);

  useEffect(() => {
    const storedAmbientMode = localStorage.getItem('ambientMode');
    setAmbientMode(storedAmbientMode === 'true');
  }, []);

  const toggleAmbientMode = () => {
    const newAmbientMode = !ambientMode;
    setAmbientMode(newAmbientMode);
    localStorage.setItem('ambientMode', newAmbientMode.toString());
  };

  return { ambientMode, toggleAmbientMode };
};