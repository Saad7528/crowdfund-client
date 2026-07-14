import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-glow"></div>
      
      <div className="notfound-content">
        <div className="notfound-cosmic-box">
          <div className="notfound-astronaut">
            <Rocket size={48} className="rocket-float" />
          </div>
          <h1 className="notfound-title">404</h1>
        </div>

        <h2 className="notfound-subtitle">Lost in Deep Space</h2>
        <p className="notfound-text">
          Oops! The page you are looking for has drifted beyond our event horizon. 
          It might have been renamed, removed, or never existed in this universe.
        </p>

        <div className="notfound-actions">
          <Link to="/" className="btn-primary notfound-btn">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/explore" className="btn-secondary notfound-btn">
            <Compass size={18} /> Explore Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
