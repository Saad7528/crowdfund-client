import React, { useEffect, useState } from 'react';
import { DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const WithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = async () => {
    const token = localStorage.getItem('access-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/withdrawals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Show pending requests on this administrative console
        const pending = data.filter(w => w.status === 'pending');
        setRequests(pending);
      }
    } catch (err) {
      console.error("Failed to load withdrawal requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handlePaymentSuccess = async (requestId) => {
    if (!window.confirm("Confirm that this withdrawal payment has been successfully sent to the creator's account. This will deduct their raised credits.")) return;

    const token = localStorage.getItem('access-token');
    try {
      const response = await fetch(`${API_URL}/withdrawals/status/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Withdrawal marked as approved. Creator credits balance updated.");
        fetchWithdrawals();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to approve withdrawal request.");
      }
    } catch (err) {
      console.error("Error confirming payment success:", err);
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
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Withdrawal Requests</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Review and approve pending creator payout requests.</p>

      <div className="glass-panel">
        {requests.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request Date</th>
                  <th>Creator Details</th>
                  <th>Credits Requested</th>
                  <th>Payout Amount</th>
                  <th>Payment Channel</th>
                  <th>Account Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>
                      <div>{r.creator_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.creator_email}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{r.withdrawal_credit} Credits</td>
                    <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>${r.withdrawal_amount.toFixed(2)}</td>
                    <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{r.payment_system}</td>
                    <td style={{ fontFamily: 'monospace' }}>{r.account_number}</td>
                    <td>
                      <button 
                        onClick={() => handlePaymentSuccess(r._id)}
                        className="btn btn-accent" 
                        style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                      >
                        <CheckCircle2 size={16} /> Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
            No pending withdrawal requests found.
          </div>
        )}
      </div>

    </div>
  );
};

export default WithdrawalRequests;
