import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Users, UserCheck, ShieldCheck, Coins, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalSupporters: 0,
    totalCreators: 0,
    totalAvailableCredits: 0,
    totalPaymentsProcessed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      const token = localStorage.getItem('access-token');
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Admin Console</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Global platform status and operational stats.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>Supporters Registered</h3>
            <div className="stat-number">{stats.totalSupporters}</div>
          </div>
          <div className="stat-icon-box purple"><Users size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Creators Registered</h3>
            <div className="stat-number">{stats.totalCreators}</div>
          </div>
          <div className="stat-icon-box pink"><UserCheck size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Credits Sold</h3>
            <div className="stat-number gradient-text">{stats.totalAvailableCredits}</div>
          </div>
          <div className="stat-icon-box green"><Coins size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Payments Processed</h3>
            <div className="stat-number">${stats.totalPaymentsProcessed}</div>
          </div>
          <div className="stat-icon-box yellow"><CreditCard size={24} /></div>
        </div>
      </div>

      {/* Admin Quick Action Hub */}
      <div className="glass-panel" style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Administrative Actions</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Select an administrative module from below or navigate using the sidebar:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <Link to="/dashboard/manage-users" className="btn btn-secondary" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textSelf: 'center' }}>
            <Users size={24} className="gradient-text" />
            <span>Manage User Roles</span>
          </Link>
          <Link to="/dashboard/manage-campaigns" className="btn btn-secondary" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textSelf: 'center' }}>
            <ShieldCheck size={24} className="gradient-text" />
            <span>Approve Campaigns</span>
          </Link>
          <Link to="/dashboard/withdrawal-requests" className="btn btn-secondary" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textSelf: 'center' }}>
            <CreditCard size={24} className="gradient-text" />
            <span>Process Withdrawals</span>
          </Link>
          <Link to="/dashboard/reports" className="btn btn-secondary" style={{ padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', textSelf: 'center' }}>
            <Coins size={24} className="gradient-text" />
            <span>Review Fraud Reports</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminHome;
