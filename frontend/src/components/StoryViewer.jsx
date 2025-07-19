import React, { useEffect } from 'react';

const StoryViewer = ({ image, onClose }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 10000); 

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 progress-bar-container">
        <div className="progress-bar-fill" />
      </div>

      {/* Story image */}
      <img
        src={image}
        alt="story"
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
};

export default StoryViewer;
