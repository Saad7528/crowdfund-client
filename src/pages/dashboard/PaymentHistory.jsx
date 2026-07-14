import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('access-token');
      if (!token) return;

      try {
        let endpoint = '';
        if (user.role === 'Supporter') {
          endpoint = `${API_URL}/payments`;
        } else if (user.role === 'Creator') {
          endpoint = `${API_URL}/withdrawals`;
        }

        const response = await fetch(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
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
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Payment History</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
        {user.role === 'Supporter' 
          ? 'Log of credit packages purchased via Stripe.' 
          : 'Log of platform credit withdrawals processed.'}
      </p>

      <div className="glass-panel">
        {history.length > 0 ? (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                {user.role === 'Supporter' ? (
                  <tr>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Credits Purchased</th>
                    <th>Amount Paid</th>
                    <th>Transaction Reference</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Date</th>
                    <th>Withdrawal Credits</th>
                    <th>Amount (USD)</th>
                    <th>Payment Channel</th>
                    <th>Account Number</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {user.role === 'Supporter' ? (
                  history.map((h) => (
                    <tr key={h._id}>
                      <td>{new Date(h.date).toLocaleDateString()} at {new Date(h.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: 'none' }}>
                        <CreditCard size={16} /> Stripe Card
                      </td>
                      <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>+{h.credits} Credits</td>
                      <td style={{ fontWeight: 600 }}>${h.amount}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{h.payment_intent_id}</td>
                    </tr>
                  ))
                ) : (
                  history.map((h) => (
                    <tr key={h._id}>
                      <td>{new Date(h.date).toLocaleDateString()} at {new Date(h.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td style={{ fontWeight: 700 }}>{h.withdrawal_credit} Credits</td>
                      <td style={{ color: 'var(--color-accent)', fontWeight: 700 }}>${h.withdrawal_amount}</td>
                      <td style={{ textTransform: 'uppercase', fontWeight: 600 }}>{h.payment_system}</td>
                      <td style={{ fontFamily: 'monospace' }}>{h.account_number}</td>
                      <td>
                        <span className={`badge badge-${h.status.toLowerCase()}`}>
                          {h.status}
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
            No transaction records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
