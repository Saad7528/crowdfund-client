import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { Search } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto my-10 px-4 md:px-8 w-full">
      
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Explore Campaigns</h2>
        <p className="text-text-secondary text-sm">Discover innovative tech, creative arts, and community causes from creators worldwide.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-bg-card border border-border-color rounded-md p-6 shadow-xl backdrop-blur-md flex flex-wrap gap-6 items-center justify-between mb-10">
        
        {/* Search */}
        <div className="flex items-center bg-bg-input border border-border-color rounded-sm px-4 py-2.5 w-full md:max-w-md">
          <Search size={18} className="text-text-muted mr-2" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-text-primary outline-none w-full text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap items-center">
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Category:</span>
            <select 
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSearchParams(e.target.value === 'All' ? {} : { category: e.target.value });
              }}
              className="px-3 py-2 bg-bg-input border border-border-color rounded-sm text-text-primary text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Community">Community</option>
              <option value="Health">Health</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-semibold uppercase tracking-wider">Sort By:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 bg-bg-input border border-border-color rounded-sm text-text-primary text-sm focus:outline-none focus:border-primary cursor-pointer"
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
        <div className="flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-text-secondary">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-card border border-border-color rounded-md p-16 text-center text-text-secondary">
          <h3 className="text-lg font-bold">No campaigns found</h3>
          <p className="text-sm mt-2 text-text-muted">Try adjusting your filters or search keywords.</p>
        </div>
      )}

    </div>
  );
};

export default Explore;
