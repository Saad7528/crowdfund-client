import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Coins, Heart, Clock, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const SupporterHome = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalContributions: 0,
    pendingContributions: 0,
    totalAmountContributed: 0
  });
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSupporterData = async () => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Approved Contributions
      const contributionsRes = await fetch(`${API_URL}/contributions?supporter_email=${user.email}&status=approved`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (contributionsRes.ok) {
        const contData = await contributionsRes.json();
        setApprovedContributions(contData.data || []);
      }
    } catch (err) {
      console.error("Error loading supporter home data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSupporterData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Supporter Console</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Welcome back, {user.name}! Thank you for backing awesome ideas.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Pledges</h3>
            <div className="stat-number">{stats.totalContributions}</div>
          </div>
          <div className="stat-icon-box purple"><Heart size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Pending Decisions</h3>
            <div className="stat-number">{stats.pendingContributions}</div>
          </div>
          <div className="stat-icon-box yellow"><Clock size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Credits Contributed</h3>
            <div className="stat-number gradient-text">{stats.totalAmountContributed}</div>
          </div>
          <div className="stat-icon-box green"><Coins size={24} /></div>
        </div>
      </div>

      {/* Approved Contributions Table */}
      <div className="glass-panel" style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Approved Contributions</h3>
        
        {approvedContributions.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Campaign Title</th>
                  <th>Amount Contributed</th>
                  <th>Creator Name</th>
                  <th>Status</th>
                  <th>Date Approved</th>
                </tr>
              </thead>
              <tbody>
                {approvedContributions.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.campaign_title}</td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{c.contribution_amount} Credits</td>
                    <td>{c.creator_name}</td>
                    <td>
                      <span className="badge badge-approved">{c.status}</span>
                    </td>
                    <td>{new Date(c.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            No approved contributions found. Go explore campaigns and back some projects!
          </div>
        )}
      </div>

    </div>
  );
};

export default SupporterHome;
