import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/game');
  };

  return (
    <div className='error404'>
      <h1>Error 404</h1>
      <h2>Oops! Page not found...</h2>
      <button className='backToGame' onClick={handleRedirect}>Back to Game</button>
    </div>
  );
}

export default Error404;
