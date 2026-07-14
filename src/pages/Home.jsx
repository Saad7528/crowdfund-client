import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import { 
  Compass, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Users, 
  Coins, 
  Globe, 
  Heart, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Home = () => {
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero Slider Banners State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Fuel Visionary Projects",
      subtitle: "Join a global network of Supporters funding next-generation technology, art, and community causes.",
      bg: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1500",
      cta: "Explore Projects",
      link: "/explore"
    },
    {
      title: "Empower Creators Everywhere",
      subtitle: "Launch your campaign, set a funding goal, and gather Supporters to turn your creative concepts into reality.",
      bg: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1500",
      cta: "Launch Campaign",
      link: "/dashboard"
    },
    {
      title: "Transparency & Credits Security",
      subtitle: "Purchase platform credits securely via Stripe and decide exactly which campaigns deserve your backing.",
      bg: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1500",
      cta: "Buy Credits",
      link: "/dashboard/purchase-credit"
    }
  ];

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Tech Creator",
      quote: "NovaFund helped us raise 8,000 credits to build our solar water filtration device. The creator dashboards and credit withdrawals process are seamless!",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "Sophia Martinez",
      role: "Backer & Supporter",
      quote: "I love browsing categories on NovaFund and pledging to direct community causes. The credit top-up using Stripe makes supporting visionary ideas instant and risk-free.",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
    },
    {
      name: "Liam O'Connor",
      role: "Artist & Designer",
      quote: "Being able to refund back to supporters if a campaign is deleted shows the platform cares about security and trust. Highly recommended for creators!",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
    }
  ];

  useEffect(() => {
    // Auto-advance hero slides
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    // Fetch and compute top campaigns based on raised credits
    const fetchTopCampaigns = async () => {
      try {
        const response = await fetch(`${API_URL}/campaigns?status=approved`);
        if (response.ok) {
          const data = await response.json();
          // Sort descending based on raised credit amount, select top 6
          const sorted = data.sort((a, b) => (b.amount_raised || 0) - (a.amount_raised || 0)).slice(0, 6);
          setTopCampaigns(sorted);
        }
      } catch (err) {
        console.error("Error fetching campaigns for home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCampaigns();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      
      {/* 1. Animated Hero Section */}
      <section className="hero-slider-section">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="hero-slide"
            style={{ 
              backgroundImage: `url(${slide.bg})`,
              opacity: currentSlide === index ? 1 : 0,
              position: index === 0 ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: currentSlide === index ? 1 : 0
            }}
          >
            <div className="hero-content">
              <h1 className="gradient-text">{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <Link to={slide.link} className="btn btn-primary btn-lg">
                {slide.cta} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="social-icon-btn" 
          style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="social-icon-btn" 
          style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, cursor: 'pointer' }}
        >
          <ChevronRight size={24} />
        </button>
      </section>

      {/* 2. Platform Impact in Numbers Section (Extra 1) */}
      <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-details">
              <h3>Total Funds Raised</h3>
              <div className="stat-number gradient-text">24,800+</div>
            </div>
            <div className="stat-icon-box purple"><Coins size={24} /></div>
          </div>

          <div className="stat-card">
            <div className="stat-details">
              <h3>Active Backers</h3>
              <div className="stat-number">1,420+</div>
            </div>
            <div className="stat-icon-box pink"><Users size={24} /></div>
          </div>

          <div className="stat-card">
            <div className="stat-details">
              <h3>Countries Supported</h3>
              <div className="stat-number">14+</div>
            </div>
            <div className="stat-icon-box green"><Globe size={24} /></div>
          </div>

          <div className="stat-card">
            <div className="stat-details">
              <h3>Fund Success Rate</h3>
              <div className="stat-number">94.8%</div>
            </div>
            <div className="stat-icon-box yellow"><Zap size={24} /></div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section (Extra 2) */}
      <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Support amazing campaigns or start raising funds in three quick steps</p>
        </div>

        <div className="stats-grid" style={{ marginTop: '40px' }}>
          <div className="glass-panel" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div className="stat-icon-box purple" style={{ width: '60px', height: '60px' }}><Compass size={28} /></div>
            <h3>1. Explore Visionary Projects</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Browse through multiple categories including Technology, Art, Community and Health. Find projects that capture your heart.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div className="stat-icon-box pink" style={{ width: '60px', height: '60px' }}><Heart size={28} /></div>
            <h3>2. Contribute Platform Credits</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Top up your balance securely via Stripe, select a campaign, enter your contribution amount, and pledge your credits.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div className="stat-icon-box green" style={{ width: '60px', height: '60px' }}><ShieldCheck size={28} /></div>
            <h3>3. Project Success & Withdrawals</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Creators receive approval from the admin and withdraw their raised credits to dollar accounts based on the platform rules.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Top Funded Campaigns Section */}
      <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div className="section-header">
          <h2>Top Funded Campaigns</h2>
          <p>Visionary projects backed by our amazing community of supporters</p>
        </div>

        {loading ? (
          <div className="spinner-container" style={{ minHeight: '30vh' }}>
            <div className="modern-spinner"></div>
          </div>
        ) : topCampaigns.length > 0 ? (
          <div className="campaign-grid">
            {topCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            No campaigns have been approved yet. Check back soon!
          </div>
        )}
      </section>

      {/* 5. Explore by Category Section (Extra 3) */}
      <section className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
        <div className="section-header">
          <h2>Browse By Category</h2>
          <p>Find campaigns in specific areas you care about</p>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
          {['Technology', 'Art', 'Community', 'Health'].map((category) => (
            <Link 
              key={category} 
              to={`/explore?category=${category}`} 
              className="btn btn-secondary"
              style={{ padding: '16px 32px', borderRadius: '12px', fontSize: '1rem', border: '1px solid var(--border-color)', minWidth: '150px' }}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Testimonial Section */}
      <section className="testimonials-section">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header">
            <h2>Community Success Stories</h2>
            <p>Listen to what our active backers and visionary creators say</p>
          </div>

          <div className="testimonial-swiper-container">
            <div className="testimonial-card glass-panel">
              <p className="testimonial-quote">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="testimonial-author">
                <img 
                  src={testimonials[currentTestimonial].photo} 
                  alt={testimonials[currentTestimonial].name} 
                  className="testimonial-avatar"
                />
                <div className="testimonial-details">
                  <div className="testimonial-name">{testimonials[currentTestimonial].name}</div>
                  <div className="testimonial-role">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            {/* Dots */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '24px' }}>
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: currentTestimonial === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
