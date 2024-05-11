import React, { useState } from 'react';
import Slider from 'react-slider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import difficultyApi from './difficultyApi';

const DifficultySlider = ({ onConfirm }) => { 
  const [languageLevel, setLanguageLevel] = useState(0);

  const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleChange = value => {
    setLanguageLevel(value);
  };

  const handleConfirm = async () => {
    const selectedLevel = languageLevels[languageLevel];
    toast.success(`Selected level: ${selectedLevel}`);
    
    const response = await difficultyApi(selectedLevel);
    
    if (response.success) {
      if (onConfirm) { 
        onConfirm(); 
      }
    } else {
      toast.error("Failed to send difficulty level to server.");
    }
  };

  return (
    <div className="slider-container">
      <h2>Select your English language level:</h2>
      <div className="level-labels">
        {languageLevels.map((level, index) => (
          <div key={index}>{level}</div>
        ))}
      </div>
      <div className="slider-wrapper">
        <div className="level-bar">
          {languageLevels.map((level, index) => (
            <div
              key={index}
              className={`level ${index === languageLevel ? 'active' : ''}`}
            />
          ))}
        </div>
        <Slider
          min={0}
          max={languageLevels.length - 1}
          value={languageLevel}
          onChange={handleChange}
          renderThumb={(props, state) => (
            <div className="thumb" {...props} />
          )}
          renderTrack={(props, state) => (
            <div className="track" {...props} />
          )}
        />
        <div className="new-track" style={{ width: `${(languageLevel / (languageLevels.length - 1)) * 100}%` }} />
        <button className='confirmButton' onClick={handleConfirm}>OK!</button>
      </div>
    </div>
  );
};

export default DifficultySlider;
