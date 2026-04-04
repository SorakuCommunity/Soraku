import React from 'react';

const TrailerModal = ({ visible, onClose, trailerId }) => {
  if (!visible) return null;

  return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
          <div className="bg-primary p-4 rounded shadow">
            <iframe
              title="Anime Trailer"
              width="100%" // Adjust to fit the screen
              height="315"
              src={`https://www.youtube.com/embed/${trailerId}`} // Fixed source to YouTube embed URL
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button
              onClick={onClose}
              className="mt-2 px-2 py-1 text-white bg-secondary rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
  );
};

export default TrailerModal;
