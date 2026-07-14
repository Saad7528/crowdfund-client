import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { Trash2, Edit3, Loader, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyCampaigns = () => {
  const { user, syncUserSession } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editCampaign, setEditCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editReward, setEditReward] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchCampaigns = async () => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/campaigns?creator=${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error("Failed to fetch creator campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  // Handle Edit Action Click
  const openEditModal = (c) => {
    setEditCampaign(c);
    setEditTitle(c.title);
    setEditStory(c.story || c.campaign_story || '');
    setEditReward(c.reward_info || '');
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmittingEdit(true);

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/campaigns/${editCampaign._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          campaign_story: editStory,
          reward_info: editReward
        })
      });

      if (response.ok) {
        await fetchCampaigns();
        setEditCampaign(null);
      } else {
        alert("Failed to update campaign details.");
      }
    } catch (err) {
      console.error("Error editing campaign:", err);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete Campaign (Triggers server refunds)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign? This action is permanent and will fully refund all approved supporters of this campaign!")) return;

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh local listings
        await fetchCampaigns();
        // Sync user raised credits
        await syncUserSession(user.email, token);
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
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Campaigns</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Dashboard listing for your created crowdfunding proposals.</p>

      <div className="glass-panel">
        {campaigns.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Funding Goal</th>
                  <th>Amount Raised</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td><span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>{c.category}</span></td>
                    <td style={{ fontWeight: 600 }}>{c.funding_goal} Credits</td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{c.amount_raised || 0} Credits</td>
                    <td>{new Date(c.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${c.status.toLowerCase()}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => openEditModal(c)}
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px' }}
                          title="Edit Campaign"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(c._id)}
                          className="btn btn-danger" 
                          style={{ padding: '8px 12px' }}
                          title="Delete Campaign"
                        >
                          <Trash2 size={16} />
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
            You haven't launched any campaigns yet. Click "Add New Campaign" to get started!
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editCampaign && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '600px' }}>
            <h3 className="modal-title">Update Campaign</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Modify details for your campaign: <strong>{editCampaign.title}</strong>
            </p>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Campaign Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Campaign Story</label>
                <textarea 
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="form-textarea"
                  style={{ minHeight: '150px' }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="form-label">Reward Info</label>
                <input 
                  type="text" 
                  value={editReward}
                  onChange={(e) => setEditReward(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setEditCampaign(null)} 
                  className="btn btn-secondary"
                  disabled={submittingEdit}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingEdit}
                >
                  {submittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyCampaigns;
