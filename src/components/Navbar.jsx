import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { LogIn, UserPlus, LogOut, Code } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full h-20 px-4 md:px-8 flex items-center justify-between border-b border-border-color bg-bg-dark/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-tight font-display">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-extrabold">NovaFund</span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <NavLink 
          to="/explore" 
          className={({ isActive }) => `text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Explore Campaigns
        </NavLink>
        {user && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Dashboard
          </NavLink>
        )}
        <a 
          href="https://github.com/Saad7528/crowdfund-client" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors duration-300 flex items-center gap-1.5"
        >
          <Code size={18} /> Join as Developer
        </a>
      </nav>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="px-3 py-1 bg-accent/15 border border-accent/30 text-accent rounded-full text-xs font-bold tracking-wide">
              {user.credits !== undefined ? user.credits : 0} Credits
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 group">
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                  alt={user.name} 
                  className="w-9 h-9 rounded-full border border-border-color object-cover group-hover:border-primary transition-colors duration-300"
                />
                <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors duration-300 hidden md:block">
                  {user.name?.split(' ')[0]}
                </span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="p-2 border border-border-color bg-transparent text-text-primary hover:bg-white/5 rounded-sm transition-all duration-300 cursor-pointer" 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <Link 
              to="/login" 
              className="px-4 py-2 border border-border-color bg-transparent text-text-primary text-sm font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn size={16} /> Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={16} /> Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
