import React from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Calendar } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const {
    _id,
    title,
    story,
    category,
    funding_goal,
    amount_raised = 0,
    image_url,
    deadline,
    creator_name
  } = campaign;

  // Calculate percentage raised
  const percentRaised = Math.min(Math.round((amount_raised / funding_goal) * 100), 100);

  // Format dates
  const daysLeft = Math.max(0, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="campaign-card">
      <div className="campaign-card-img-box">
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'} 
          alt={title} 
          className="campaign-card-img"
        />
        <span className="campaign-card-category">{category}</span>
      </div>

      <div className="campaign-card-content">
        <h3 className="campaign-card-title">{title}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>by {creator_name}</p>
        <p className="campaign-card-story">{story}</p>

        <div className="campaign-progress-bar-bg">
          <div className="campaign-progress-bar-fill" style={{ width: `${percentRaised}%` }}></div>
        </div>

        <div className="campaign-card-stats">
          <div>
            <span className="campaign-card-stat-val">{amount_raised}</span>
            <div className="campaign-card-stat-label">Raised Credits</div>
          </div>
          <div>
            <span className="campaign-card-stat-val">{percentRaised}%</span>
            <div className="campaign-card-stat-label">Funded</div>
          </div>
          <div>
            <span className="campaign-card-stat-val">{daysLeft}</span>
            <div className="campaign-card-stat-label">Days Left</div>
          </div>
        </div>

        <Link to={`/campaigns/${_id}`} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
