import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { Award, ShieldAlert, Heart, ArrowLeft } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-text-secondary">Loading campaign details...</p>
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
    <div className="max-w-7xl mx-auto my-10 px-4 md:px-8 w-full">
      
      {/* Back button */}
      <Link to="/explore" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 font-semibold transition-colors duration-300">
        <ArrowLeft size={16} /> Back to Explore
      </Link>

      {/* Main Campaign Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1.2fr] gap-8 items-start">
        
        {/* Left Side: Campaign Media + Story */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-bg-card border border-border-color rounded-md overflow-hidden shadow-xl backdrop-blur-md">
            <img 
              src={image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'} 
              alt={title} 
              className="w-full max-h-[450px] object-cover"
            />
          </div>

          <div className="bg-bg-card border border-border-color rounded-md p-6 md:p-8 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-primary/15 border border-primary/30 text-primary rounded-sm text-xs font-bold uppercase tracking-wider">{category}</span>
              {user && user.role === 'Supporter' && (
                <button 
                  onClick={() => setShowReportModal(true)} 
                  className="px-3 py-1.5 border border-danger/20 bg-transparent text-danger hover:bg-danger/5 rounded-sm text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert size={14} /> Report Campaign
                </button>
              )}
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight mt-2">{title}</h1>
            <p className="text-sm text-text-secondary">
              Launched by <strong className="text-text-primary">{creator_name}</strong> ({creator_email})
            </p>

            <hr className="border-border-color my-2" />

            <h3 className="text-lg font-bold text-text-primary">Campaign Story</h3>
            <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">{story}</p>
          </div>

        </div>

        {/* Right Side: Progress Stats + Pledge Widget */}
        <div className="flex flex-col gap-8">
          
          {/* Progress Widget */}
          <div className="bg-bg-card border border-border-color rounded-md p-6 md:p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-extrabold font-display text-accent">
                  {amount_raised}
                </span>
                <span className="text-text-secondary text-xs">
                  raised of {funding_goal} goal
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${percentRaised}%` }}></div>
              </div>
              <div className="flex justify-between text-text-secondary text-xs">
                <span>{percentRaised}% Funded</span>
                <span>{daysLeft} Days Left</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-border-color py-4">
              <div>
                <span className="block text-[10px] text-text-muted uppercase tracking-wider">Min Pledge</span>
                <strong className="text-sm text-text-primary">{minimum_contribution} Credits</strong>
              </div>
              <div>
                <span className="block text-[10px] text-text-muted uppercase tracking-wider">Deadline Date</span>
                <strong className="text-sm text-text-primary">{new Date(deadline).toLocaleDateString()}</strong>
              </div>
            </div>

            <div>
              <span className="flex items-center gap-1.5 text-xs text-text-muted uppercase tracking-wider font-semibold mb-3">
                <Award size={16} className="text-primary" /> Supporter Rewards
              </span>
              <p className="text-xs text-text-secondary bg-white/2 p-4 rounded-sm border border-border-color leading-relaxed">
                {reward_info || "No rewards listed for this campaign."}
              </p>
            </div>
          </div>

          {/* Pledge Card */}
          <div className="bg-bg-card border border-border-color rounded-md p-6 md:p-8 shadow-xl backdrop-blur-md flex flex-col gap-4">
            <h3 className="text-lg font-bold">Back This Project</h3>
            
            {contributionError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-danger/10 border-danger/20 text-danger">
                <ShieldAlert size={16} />
                <span>{contributionError}</span>
              </div>
            )}

            {contributionSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-accent/10 border-accent/20 text-accent">
                <Heart size={16} />
                <span>{contributionSuccess}</span>
              </div>
            )}

            {isDeadlinePassed ? (
              <div className="text-center text-text-muted py-6 text-sm">
                This campaign has ended and is no longer accepting contributions.
              </div>
            ) : !user ? (
              <div className="flex flex-col gap-4">
                <p className="text-text-secondary text-sm">
                  Please login to support this project with your credits.
                </p>
                <Link 
                  to="/login" 
                  className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 text-center cursor-pointer shadow-lg shadow-indigo-500/10"
                >
                  Sign In to Contribute
                </Link>
              </div>
            ) : user.role !== 'Supporter' ? (
              <p className="text-text-muted text-xs text-center py-6">
                Your current role is <strong>{user.role}</strong>. Only Supporters can contribute.
              </p>
            ) : (
              <form onSubmit={handleContributionSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-text-secondary">Contribution Amount (Credits)</label>
                  <input 
                    type="number" 
                    min={minimum_contribution}
                    placeholder={`Min. ${minimum_contribution}`}
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm"
                    required
                  />
                </div>
                
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Available Balance:</span>
                  <span className="font-bold text-accent">{user.credits} Credits</span>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 text-center cursor-pointer shadow-lg shadow-indigo-500/10 disabled:opacity-50"
                  disabled={submittingContribution}
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
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-bg-card border border-border-color rounded-md p-8 max-w-md w-full shadow-2xl relative flex flex-col gap-4">
            <h3 className="text-lg font-bold">Report Fraudulent Campaign</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Please describe why you believe this campaign violates platform rules or is fraudulent.
            </p>

            {reportError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-danger/10 border-danger/20 text-danger">
                <ShieldAlert size={16} />
                <span>{reportError}</span>
              </div>
            )}

            {reportSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-accent/10 border-accent/20 text-accent">
                <Heart size={16} />
                <span>{reportSuccess}</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-text-secondary">Reason for Report</label>
                <textarea 
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-24 px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm resize-none"
                  placeholder="Provide details about suspicious links, plagiarism, or fraudulent claims..."
                  required
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)} 
                  className="px-4 py-2 border border-border-color bg-transparent text-text-primary text-sm font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 cursor-pointer"
                  disabled={submittingReport}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-danger hover:bg-danger/80 text-white text-sm font-semibold rounded-sm transition-all duration-300 cursor-pointer disabled:opacity-50"
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
