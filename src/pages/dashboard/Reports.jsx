import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { AlertOctagon, Trash, ShieldCheck, Calendar, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // For supporters, filter reports client-side to only show their reports
        if (user.role === 'Supporter') {
          const userReports = data.filter(r => r.reporter_email === user.email);
          setReports(userReports);
        } else {
          setReports(data);
        }
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  // Admin action: Delete Reported Campaign (suspends/deletes campaign + refunds)
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign? This will refund all approved contributors and delete associated comments/reports.")) return;
    
    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Campaign deleted successfully. Supporters have been refunded.");
        fetchReports();
      } else {
        alert("Failed to delete campaign.");
      }
    } catch (err) {
      console.error("Error deleting reported campaign:", err);
    }
  };

  // Admin action: Dismiss Report
  const handleDismissReport = async (reportId) => {
    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Report dismissed.");
        fetchReports();
      } else {
        alert("Failed to dismiss report.");
      }
    } catch (err) {
      console.error("Error dismissing report:", err);
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
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
        {user.role === 'Admin' ? 'Fraud & Abuse Reports' : 'My Filed Reports'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        {user.role === 'Admin' 
          ? 'Manage and resolve flagged campaigns submitted by Supporters.' 
          : 'List of reports you have filed for campaigns you flagged as suspicious.'}
      </p>

      <div className="glass-panel">
        {reports.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                {user.role === 'Admin' ? (
                  <tr>
                    <th>Date</th>
                    <th>Flagged Campaign</th>
                    <th>Reporter Details</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Date Reported</th>
                    <th>Campaign Title</th>
                    <th>Your Stated Reason</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {user.role === 'Admin' ? (
                  reports.map((r) => (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{r.campaign_title}</td>
                      <td>
                        <div>{r.reporter_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.reporter_email}</div>
                      </td>
                      <td style={{ maxWidth: '300px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.reason}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleDeleteCampaign(r.campaign_id)}
                            className="btn btn-danger"
                            style={{ padding: '8px 12px' }}
                            title="Delete Campaign"
                          >
                            <Trash size={16} /> Delete
                          </button>
                          <button 
                            onClick={() => handleDismissReport(r._id)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px' }}
                            title="Dismiss Report"
                          >
                            <ShieldCheck size={16} /> Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  reports.map((r) => (
                    <tr key={r._id}>
                      <td>{new Date(r.date).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>{r.campaign_title}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.reason}</td>
                      <td>
                        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <Info size={12} /> Under Review
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            {user.role === 'Admin' 
              ? 'No active campaign reports. Excellent!' 
              : 'You have not reported any campaigns.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
