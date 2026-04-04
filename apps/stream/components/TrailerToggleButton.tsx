import { useState, useEffect } from 'react';

const TrailerToggleButton = () => {
  const [isTrailerDisabled, setIsTrailerDisabled] = useState(false);

  useEffect(() => {
    setIsTrailerDisabled(localStorage.getItem('disableTrailer') === 'true');
  }, []);

  const toggleTrailer = () => {
    const newState = !isTrailerDisabled;
    setIsTrailerDisabled(newState);
    localStorage.setItem('disableTrailer', newState.toString());
  };

  return (
    <button
      onClick={toggleTrailer}
      className="text-white px-3 py-2 text-md font-karla font-bold rounded bg-secondary transition-transform transform hover:scale-90 flex items-center space-x-2"
    >
      {isTrailerDisabled ? 'Enable Trailer' : 'Disable Trailer'}
    </button>
  );
};

export default TrailerToggleButton;