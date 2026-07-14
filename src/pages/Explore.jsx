import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { Search, Grid, ListFilter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');

  // Read URL search params (e.g. from home page category click)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        // Fetch approved campaigns
        const response = await fetch(`${API_URL}/campaigns?status=approved`);
        if (response.ok) {
          let data = await response.json();

          // Filter out campaigns where deadline has passed
          const now = new Date();
          data = data.filter(c => new Date(c.deadline) > now);

          setCampaigns(data);
        }
      } catch (err) {
        console.error("Failed to load explore campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filter and sort client-side for dynamic reactivity
  const filteredCampaigns = campaigns
    .filter(c => {
      const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.story.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortOption === 'goal-high') return b.funding_goal - a.funding_goal;
      if (sortOption === 'goal-low') return a.funding_goal - b.funding_goal;
      if (sortOption === 'raised-high') return (b.amount_raised || 0) - (a.amount_raised || 0);
      return 0;
    });

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      
      <div className="section-header">
        <h2>Explore Campaigns</h2>
        <p>Discover innovative tech, creative arts, and community causes from creators worldwide.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 12px', flexGrow: 1, maxWidth: '400px', minWidth: '250px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSearchParams(e.target.value === 'All' ? {} : { category: e.target.value });
              }}
              className="form-select"
              style={{ padding: '8px 12px', width: 'auto', fontSize: '0.85rem' }}
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort By:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="form-select"
              style={{ padding: '8px 12px', width: 'auto', fontSize: '0.85rem' }}
            >
              <option value="newest">Recently Added</option>
              <option value="deadline">Closest Deadline</option>
              <option value="goal-high">Highest Goal</option>
              <option value="goal-low">Lowest Goal</option>
              <option value="raised-high">Most Funded</option>
            </select>
          </div>

        </div>
      </div>

      {/* Campaigns Grid */}
      {loading ? (
        <div className="spinner-container">
          <div className="modern-spinner"></div>
          <p className="loading-text">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="campaign-grid">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No campaigns found</h3>
          <p style={{ marginTop: '10px' }}>Try adjusting your filters or search keywords.</p>
        </div>
      )}

    </div>
  );
};

export default Explore;
