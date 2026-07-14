import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { LogIn, UserPlus, LogOut, Code, LayoutDashboard } from 'lucide-react';

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
    <header className="landing-navbar">
      <Link to="/" className="sidebar-logo">
        <span className="gradient-text">NovaFund</span>
      </Link>

      <nav className="landing-nav-links">
        <NavLink 
          to="/explore" 
          className={({ isActive }) => `landing-nav-link ${isActive ? 'active' : ''}`}
        >
          Explore Campaigns
        </NavLink>
        {user && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `landing-nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>
        )}
        <a 
          href="https://github.com/s-m-amirulislamsaad/Crowdfunding-Platform-Client" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="landing-nav-link"
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Code size={18} /> Join as Developer
        </a>
      </nav>

      <div className="landing-nav-actions">
        {user ? (
          <>
            <div className="navbar-credits-pill">
              {user.credits !== undefined ? user.credits : 0} Credits
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                  alt={user.name} 
                  className="user-header-avatar"
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'none', md: 'block' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 14px' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              <LogIn size={16} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
              <UserPlus size={16} /> Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
