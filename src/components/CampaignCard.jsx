import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="flex flex-col bg-bg-card border border-border-color rounded-md overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-xl backdrop-blur-md h-[500px]">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-4 left-4 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-sm uppercase tracking-wider">{category}</span>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-2">
        <h3 className="text-lg font-bold tracking-tight text-text-primary line-clamp-1">{title}</h3>
        <p className="text-xs text-text-muted">by {creator_name}</p>
        <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed my-2">{story}</p>

        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mt-auto mb-2">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${percentRaised}%` }}></div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-border-color pt-4 mb-4 text-center">
          <div>
            <span className="block text-sm font-bold text-text-primary">{amount_raised}</span>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Raised</div>
          </div>
          <div>
            <span className="block text-sm font-bold text-text-primary">{percentRaised}%</span>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Funded</div>
          </div>
          <div>
            <span className="block text-sm font-bold text-text-primary">{daysLeft}</span>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mt-1">Days Left</div>
          </div>
        </div>

        <Link 
          to={`/campaigns/${_id}`} 
          className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 text-center cursor-pointer shadow-lg shadow-indigo-500/10"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;
