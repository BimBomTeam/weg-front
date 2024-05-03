import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <div className="loader-text">Loading...</div>
    </div>
  );
}

export default Loader;
