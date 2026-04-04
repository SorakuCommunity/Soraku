import React from 'react';

const BufferingIndicator = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center h-full w-full bg-black bg-opacity-50">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default BufferingIndicator;
