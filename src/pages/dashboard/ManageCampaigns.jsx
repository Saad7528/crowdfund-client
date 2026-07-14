import React, { useEffect, useState } from 'react';
import { ShieldCheck, XOctagon, Trash, HelpCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/campaigns`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleStatusChange = async (campaignId, status) => {
    if (!window.confirm(`Are you sure you want to set status to ${status}?`)) return;

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/campaigns/status/${campaignId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Campaign has been ${status}.`);
        fetchCampaigns();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error setting campaign status:", err);
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm("Are you sure you want to permanently delete this campaign? This will remove all associated logs and refund all approved pledges back to Supporters!")) return;

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Campaign deleted successfully. Supporters refunded.");
        fetchCampaigns();
      } else {
        alert("Failed to delete campaign.");
      }
    } catch (err) {
      console.error("Error deleting campaign:", err);
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
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Manage Campaigns</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Approve new creator pitches, review project standings, or remove invalid listings.</p>

      <div className="glass-panel">
        {campaigns.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Cover / Title</th>
                  <th>Creator</th>
                  <th>Funding Goal</th>
                  <th>Amt Raised</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Action Approval</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={c.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=100'} 
                          alt={c.title} 
                          className="user-header-avatar"
                          style={{ width: '40px', height: '40px', borderRadius: '4px' }}
                        />
                        <span style={{ fontWeight: 600, maxWidth: '180px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.title}>
                          {c.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div>{c.creator_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.creator_email}</div>
                    </td>
                    <td>{c.funding_goal} Credits</td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{c.amount_raised || 0} Credits</td>
                    <td>{new Date(c.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      {c.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            onClick={() => handleStatusChange(c._id, 'approved')}
                            className="btn btn-accent" 
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                          >
                            <ShieldCheck size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(c._id, 'rejected')}
                            className="btn btn-secondary" 
                            style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            <XOctagon size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No action required</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteCampaign(c._id)}
                        className="btn btn-danger" 
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      >
                        <Trash size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            No campaigns found on the platform.
          </div>
        )}
      </div>

    </div>
  );
};

export default ManageCampaigns;
