import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { 
  Home, 
  Search, 
  FileHeart, 
  PlusCircle, 
  FolderGit, 
  ArrowUpRight, 
  History, 
  AlertOctagon, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem('access-token');
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotificationClick = async (notif) => {
    // Mark as read
    const token = localStorage.getItem('access-token');
    if (token && !notif.read) {
      try {
        await fetch(`${API_URL}/notifications/read/${notif._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchNotifications();
      } catch (err) {
        console.error("Error reading notification:", err);
      }
    }
    // Toggle pop-up close and redirect
    setShowNotifications(false);
    if (notif.actionRoute) {
      navigate(notif.actionRoute);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  // Navigation configurations based on role
  const getNavLinks = () => {
    if (user.role === 'Supporter') {
      return [
        { path: '/dashboard/supporter-home', label: 'Home', icon: <Home size={18} /> },
        { path: '/explore', label: 'Explore Campaigns', icon: <Search size={18} /> },
        { path: '/dashboard/my-contributions', label: 'My Contributions', icon: <FileHeart size={18} /> },
        { path: '/dashboard/purchase-credit', label: 'Purchase Credit', icon: <ArrowUpRight size={18} /> },
        { path: '/dashboard/payments', label: 'Payment History', icon: <History size={18} /> },
        { path: '/dashboard/reports', label: 'Reports', icon: <AlertOctagon size={18} /> }
      ];
    } else if (user.role === 'Creator') {
      return [
        { path: '/dashboard/creator-home', label: 'Home', icon: <Home size={18} /> },
        { path: '/dashboard/add-campaign', label: 'Add New Campaign', icon: <PlusCircle size={18} /> },
        { path: '/dashboard/my-campaigns', label: 'My Campaigns', icon: <FolderGit size={18} /> },
        { path: '/dashboard/withdrawals', label: 'Withdrawals', icon: <ArrowUpRight size={18} /> },
        { path: '/dashboard/payments', label: 'Payment History', icon: <History size={18} /> }
      ];
    } else if (user.role === 'Admin') {
      return [
        { path: '/dashboard/admin-home', label: 'Home', icon: <Home size={18} /> },
        { path: '/dashboard/manage-users', label: 'Manage Users', icon: <Users size={18} /> },
        { path: '/dashboard/manage-campaigns', label: 'Manage Campaigns', icon: <FolderGit size={18} /> },
        { path: '/dashboard/withdrawal-requests', label: 'Withdrawal Requests', icon: <ArrowUpRight size={18} /> },
        { path: '/dashboard/reports', label: 'Reports', icon: <AlertOctagon size={18} /> }
      ];
    }
    return [];
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <Link to="/" className="sidebar-logo">
            <span className="gradient-text">NovaFund</span>
          </Link>
        </div>

        {/* User Card */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
            alt={user.name} 
            className="user-header-avatar"
            style={{ width: '45px', height: '45px' }}
          />
          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <h4 style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</h4>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
              <span className="badge badge-approved" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{user.role}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700, marginTop: '4px' }}>
              {user.credits !== undefined ? user.credits : 0} Credits
            </div>
          </div>
        </div>

        <nav className="dashboard-sidebar-nav">
          {getNavLinks().map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-sidebar-footer">
          <button onClick={handleLogout} className="sidebar-nav-item" style={{ border: 'none', background: 'transparent', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-right">
            {/* Notification system */}
            <div className="notifications-widget-container" ref={notificationRef}>
              <button 
                className="notification-icon-btn" 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if(!showNotifications) fetchNotifications();
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge"></span>}
              </button>

              {showNotifications && (
                <div className="notifications-popup">
                  <div className="notifications-popup-header">
                    Notifications ({unreadCount} new)
                  </div>
                  <div className="notifications-list">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          onClick={() => handleNotificationClick(notif)}
                          className={`notification-item ${!notif.read ? 'unread' : ''}`}
                        >
                          <p className="notification-message">{notif.message}</p>
                          <span className="notification-time">{new Date(notif.time).toLocaleDateString()} at {new Date(notif.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ))
                    ) : (
                      <div className="notifications-popup-empty">
                        No notifications yet.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile pill */}
            <div className="user-header-widget">
              <img 
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
                alt={user.name} 
                className="user-header-avatar"
              />
              <div className="user-header-info">
                <p className="user-header-name">{user.name?.split(' ')[0]}</p>
                <p className="user-header-role">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="dashboard-content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
