import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Calendar, Target, DollarSign, Award, ShieldAlert, Heart, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CampaignDetails = () => {
  const { id } = useParams();
  const { user, syncUserSession } = useContext(AuthContext);
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Contribution Form state
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionError, setContributionError] = useState('');
  const [contributionSuccess, setContributionSuccess] = useState('');
  const [submittingContribution, setSubmittingContribution] = useState(false);

  // Report Modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchCampaignDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/campaigns/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data);
      } else {
        navigate('/explore');
      }
    } catch (err) {
      console.error("Error loading campaign details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="modern-spinner"></div>
        <p className="loading-text">Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) return null;

  const {
    title,
    story,
    category,
    funding_goal,
    minimum_contribution,
    deadline,
    reward_info,
    image_url,
    creator_name,
    creator_email,
    amount_raised = 0
  } = campaign;

  const percentRaised = Math.min(Math.round((amount_raised / funding_goal) * 100), 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const isDeadlinePassed = new Date(deadline) < new Date();

  // Handle Contribution submit
  const handleContributionSubmit = async (e) => {
    e.preventDefault();
    setContributionError('');
    setContributionSuccess('');

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } });
      return;
    }

    if (user.role !== 'Supporter') {
      setContributionError('Only Supporters can pledge credits to campaigns.');
      return;
    }

    const amount = Number(contributionAmount);
    if (!amount || amount <= 0) {
      setContributionError('Please enter a valid contribution amount.');
      return;
    }

    if (amount < minimum_contribution) {
      setContributionError(`Minimum contribution for this campaign is ${minimum_contribution} credits.`);
      return;
    }

    if (user.credits < amount) {
      setContributionError(`Insufficient credits. You currently have ${user.credits} credits. Please purchase more credits.`);
      return;
    }

    setSubmittingContribution(true);
    const token = localStorage.getItem('access-token');

    try {
      const response = await fetch(`${API_URL}/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaign_id: id,
          campaign_title: title,
          contribution_amount: amount,
          creator_name,
          creator_email
        })
      });

      const data = await response.json();
      if (response.ok) {
        setContributionSuccess(`Your pledge of ${amount} credits was submitted! Awaiting creator approval.`);
        setContributionAmount('');
        // Sync user credits on client
        await syncUserSession(user.email, token);
      } else {
        setContributionError(data.message || 'Contribution failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setContributionError('Server error processing contribution.');
    } finally {
      setSubmittingContribution(false);
    }
  };

  // Handle Report submit
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError('');
    setReportSuccess('');

    if (!reportReason.trim()) {
      setReportError('Please provide a reason for your report.');
      return;
    }

    setSubmittingReport(true);
    const token = localStorage.getItem('access-token');

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaign_id: id,
          campaign_title: title,
          reason: reportReason
        })
      });

      if (response.ok) {
        setReportSuccess('This campaign has been reported to the administrator for review.');
        setReportReason('');
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess('');
        }, 2000);
      } else {
        const data = await response.json();
        setReportError(data.message || 'Failed to submit report.');
      }
    } catch (err) {
      console.error(err);
      setReportError('Server error submitting report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      {/* Back button */}
      <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '30px', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Explore
      </Link>

      {/* Main Campaign Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '40px' }} className="stats-grid">
        
        {/* Left Side: Campaign Media + Story */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <img 
              src={image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} 
              alt={title} 
              style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>

          <div className="glass-panel" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span className="badge badge-approved">{category}</span>
              {user && user.role === 'Supporter' && (
                <button 
                  onClick={() => setShowReportModal(true)} 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  <ShieldAlert size={14} /> Report Campaign
                </button>
              )}
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '30px' }}>
              Launched by <strong>{creator_name}</strong> ({creator_email})
            </p>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#fff' }}>Campaign Story</h3>
            <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{story}</p>
          </div>

        </div>

        {/* Right Side: Progress Stats + Pledge Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Progress Widget */}
          <div className="glass-panel" style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }}>
                  {amount_raised}
                </span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  raised of {funding_goal} goal
                </span>
              </div>
              <div className="campaign-progress-bar-bg" style={{ height: '8px' }}>
                <div className="campaign-progress-bar-fill" style={{ width: `${percentRaised}%` }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <span>{percentRaised}% Funded</span>
                <span>{daysLeft} Days Left</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '15px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '25px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Min Pledge</span>
                <strong style={{ fontSize: '1.1rem' }}>{minimum_contribution} Credits</strong>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Deadline Date</span>
                <strong style={{ fontSize: '1.1rem' }}>{new Date(deadline).toLocaleDateString()}</strong>
              </div>
            </div>

            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                <Award size={16} /> Supporter Rewards
              </span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {reward_info || "No rewards listed for this campaign."}
              </p>
            </div>
          </div>

          {/* Pledge Card */}
          <div className="glass-panel" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Back This Project</h3>
            
            {contributionError && (
              <div className="alert alert-error" style={{ fontSize: '0.85rem' }}>
                <ShieldAlert size={16} />
                <span>{contributionError}</span>
              </div>
            )}

            {contributionSuccess && (
              <div className="alert alert-success" style={{ fontSize: '0.85rem' }}>
                <Heart size={16} />
                <span>{contributionSuccess}</span>
              </div>
            )}

            {isDeadlinePassed ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                This campaign has ended and is no longer accepting contributions.
              </div>
            ) : !user ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Please login to support this project with your credits.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Sign In to Contribute
                </Link>
              </div>
            ) : user.role !== 'Supporter' ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                Your current role is <strong>{user.role}</strong>. Only Supporters can contribute.
              </p>
            ) : (
              <form onSubmit={handleContributionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label">Contribution Amount (Credits)</label>
                  <input 
                    type="number" 
                    min={minimum_contribution}
                    placeholder={`Min. ${minimum_contribution}`}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Available Balance:</span>
                  <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{user.credits} Credits</span>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submittingContribution}
                  style={{ width: '100%' }}
                >
                  {submittingContribution ? 'Pledging...' : 'Submit Contribution'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Report Fraudulent Campaign</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Please describe why you believe this campaign violates platform rules or is fraudulent.
            </p>

            {reportError && (
              <div className="alert alert-error" style={{ fontSize: '0.85rem' }}>
                <ShieldAlert size={16} />
                <span>{reportError}</span>
              </div>
            )}

            {reportSuccess && (
              <div className="alert alert-success" style={{ fontSize: '0.85rem' }}>
                <Heart size={16} />
                <span>{reportSuccess}</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label className="form-label">Reason for Report</label>
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="form-textarea"
                  placeholder="Provide details about suspicious links, plagiarism, or fraudulent claims..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  className="btn btn-secondary"
                  disabled={submittingReport}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-danger"
                  disabled={submittingReport}
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CampaignDetails;
