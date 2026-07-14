import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Home, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="relative min-h-[85vh] flex justify-center items-center p-6 md:p-10 overflow-hidden bg-bg-dark">
      <div className="absolute w-[400px] h-[400px] bg-radial from-primary/15 via-secondary/5 to-transparent blur-2xl pointer-events-none glow-pulse-anim"></div>
      
      <div className="relative z-10 max-w-xl text-center bg-bg-card border border-border-color rounded-md p-10 md:p-12 shadow-2xl backdrop-blur-md">
        <div className="relative inline-block mb-6">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-secondary">
            <Rocket size={48} className="rocket-float-anim" />
          </div>
          <h1 className="text-[7rem] md:text-[8rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_20px_rgba(99,102,241,0.3)] font-display">404</h1>
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-4 font-display">Lost in Deep Space</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          Oops! The page you are looking for has drifted beyond our event horizon. 
          It might have been renamed, removed, or never existed in this universe.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="px-6 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10">
            <Home size={18} /> Return Home
          </Link>
          <Link to="/explore" className="px-6 py-3 border border-border-color bg-transparent text-text-primary text-sm font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
            <Compass size={18} /> Explore Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
