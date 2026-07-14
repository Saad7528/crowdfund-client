import React, { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { DollarSign, Coins, ShieldAlert, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Withdrawals = () => {
  const { user, syncUserSession } = useContext(AuthContext);

  const [creditsToWithdraw, setCreditsToWithdraw] = useState('');
  const [paymentSystem, setPaymentSystem] = useState('Stripe');
  const [accountNumber, setAccountNumber] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const creatorRaisedCredits = user.raised_credits !== undefined ? user.raised_credits : 0;
  const earningsInDollars = (creatorRaisedCredits / 20).toFixed(2); // 20 Credits = 1 Dollar

  // Auto calculate dollar amount based on credits input
  const calculateDollarAmount = () => {
    if (!creditsToWithdraw) return 0;
    return (Number(creditsToWithdraw) / 20).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const credits = Number(creditsToWithdraw);
    if (!credits || credits <= 0) {
      setError('Please enter a valid credit amount to withdraw.');
      return;
    }

    if (credits < 200) {
      setError('Minimum withdrawal is 200 credits ($10.00).');
      return;
    }

    if (credits > creatorRaisedCredits) {
      setError(`You cannot withdraw more than your available raised credits (${creatorRaisedCredits} credits).`);
      return;
    }

    if (!accountNumber.trim()) {
      setError('Please provide an account number or ID.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('access-token');

    try {
      const response = await fetch(`${API_URL}/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          credits: credits,
          payment_system: paymentSystem,
          account_number: accountNumber
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(`Withdrawal request for $${calculateDollarAmount()} (${credits} credits) submitted successfully!`);
        setCreditsToWithdraw('');
        setAccountNumber('');
        // Sync user raised credits if approved (it decreases raised_credits only after admin approval)
        await syncUserSession(user.email, token);
      } else {
        setError(data.message || 'Withdrawal request failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error submitting withdrawal.');
    } finally {
      setSubmitting(false);
    }
  };

  const isBalanceInsufficient = creatorRaisedCredits < 200;

  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Withdraw Earnings</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Convert your raised campaign credits to real currency. 20 credits equals 1 US Dollar.</p>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '30px' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '30px' }}>
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Balance stats */}
      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat-card">
          <div className="stat-details">
            <h3>Raised Credits Balance</h3>
            <div className="stat-number gradient-text">{creatorRaisedCredits} Credits</div>
          </div>
          <div className="stat-icon-box green"><Coins size={24} /></div>
        </div>

        <div className="stat-card">
          <div className="stat-details">
            <h3>Value in USD</h3>
            <div className="stat-number">${earningsInDollars}</div>
          </div>
          <div className="stat-icon-box purple"><DollarSign size={24} /></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Request Cash Out</h3>

        {isBalanceInsufficient ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>
              You need a minimum of <strong>200 credits ($10.00)</strong> to request a withdrawal.
            </p>
            <span className="badge badge-rejected" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
              Insufficient credit
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Credits to Withdraw</label>
              <input 
                type="number" 
                min={200}
                max={creatorRaisedCredits}
                placeholder="Minimum 200"
                value={creditsToWithdraw}
                onChange={(e) => setCreditsToWithdraw(e.target.value)}
                className="form-input"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Maximum available: {creatorRaisedCredits} credits
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Payout Amount (USD)</label>
              <input 
                type="text" 
                value={`$${calculateDollarAmount()}`}
                className="form-input"
                style={{ background: 'rgba(255,255,255,0.02)', cursor: 'not-allowed' }}
                disabled
              />
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Select Payment System</label>
              <select 
                value={paymentSystem} 
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="form-select"
              >
                <option value="Stripe">Stripe (Direct Transfer)</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Account Number / Phone Number</label>
              <input 
                type="text" 
                placeholder="e.g. Stripe Email or Wallet Mobile No."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting Request...' : 'Withdraw'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default Withdrawals;
