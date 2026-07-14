import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Coins, Folder, Zap, Check, X, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CreatorHome = () => {
  const { user, syncUserSession } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalAmountRaised: 0
  });
  const [pendingContributions, setPendingContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedContribution, setSelectedContribution] = useState(null);

  const fetchCreatorData = async () => {
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

      // 2. Fetch Pending Contributions to Review
      const contributionsRes = await fetch(`${API_URL}/contributions?creator_email=${user.email}&status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (contributionsRes.ok) {
        const contData = await contributionsRes.json();
        setPendingContributions(contData.data || []);
      }
    } catch (err) {
      console.error("Error loading creator dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreatorData();
    }
  }, [user]);

  const handleAction = async (id, action) => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/contributions/status/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        // Refresh data
        await fetchCreatorData();
        // Sync user raised credits if approved
        await syncUserSession(user.email, token);
        setSelectedContribution(null);
      } else {
        const data = await response.json();
        alert(data.message || 'Action failed');
      }
    } catch (err) {
      console.error("Error processing contribution status:", err);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '50vh' }}>
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Creator Console</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Welcome back, {user.name}! Track supporters and review campaign actions.</p>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-details">
            <h3>Campaigns Launched</h3>
            <div className="stat-number">{stats.totalCampaigns}</div>
          </div>
          <div className="stat-icon-box purple"><Folder size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Active Campaigns</h3>
            <div className="stat-number">{stats.activeCampaigns}</div>
          </div>
          <div className="stat-icon-box yellow"><Zap size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Total Raised</h3>
            <div className="stat-number gradient-text">{stats.totalAmountRaised} Credits</div>
          </div>
          <div className="stat-icon-box green"><Coins size={24} /></div>
        </div>
      </div>

      {/* Contributions To Review Table */}
      <div className="glass-panel" style={{ marginTop: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Contributions to Review</h3>

        {pendingContributions.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Supporter Name</th>
                  <th>Campaign Title</th>
                  <th>Contribution Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingContributions.map((c) => (
                  <tr key={c._id}>
                    <td>{c.supporter_name}</td>
                    <td style={{ fontWeight: 600 }}>{c.campaign_title}</td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{c.contribution_amount} Credits</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => setSelectedContribution(c)} 
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px' }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(c._id, 'approve')} 
                          className="btn btn-accent" 
                          style={{ padding: '8px 12px' }}
                          title="Approve Contribution"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => handleAction(c._id, 'reject')} 
                          className="btn btn-danger" 
                          style={{ padding: '8px 12px' }}
                          title="Reject Contribution"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            No pending contributions to review.
          </div>
        )}
      </div>

      {/* Contribution Detail Modal */}
      {selectedContribution && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Contribution Details</h3>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SUPPORTER</span>
                <p style={{ color: '#fff', fontWeight: 600 }}>{selectedContribution.supporter_name} ({selectedContribution.supporter_email})</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CAMPAIGN</span>
                <p style={{ color: '#fff', fontWeight: 600 }}>{selectedContribution.campaign_title}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PLEDGE AMOUNT</span>
                <p style={{ color: 'var(--color-accent)', fontWeight: 700, fontSize: '1.2rem' }}>{selectedContribution.contribution_amount} Credits</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DATE SUBMITTED</span>
                <p style={{ color: '#fff' }}>{new Date(selectedContribution.date).toLocaleDateString()} at {new Date(selectedContribution.date).toLocaleTimeString()}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                onClick={() => setSelectedContribution(null)} 
                className="btn btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => handleAction(selectedContribution._id, 'reject')} 
                className="btn btn-danger"
              >
                Reject & Refund
              </button>
              <button 
                onClick={() => handleAction(selectedContribution._id, 'approve')} 
                className="btn btn-accent"
              >
                Approve Pledge
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatorHome;
