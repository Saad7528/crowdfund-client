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
    <div className="flex flex-col gap-24 pb-16">
      
      {/* 1. Animated Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden bg-bg-dark">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="absolute inset-0 bg-cover bg-center flex items-center px-4 md:px-12 lg:px-24 transition-opacity duration-1000 ease-in-out"
            style={{ 
              backgroundImage: `linear-gradient(rgba(9, 9, 11, 0.4), rgba(9, 9, 11, 0.7)), url(${slide.bg})`,
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 1 : 0
            }}
          >
            <div className="max-w-2xl bg-bg-dark/60 backdrop-blur-md border border-border-color p-8 rounded-md shadow-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{slide.title}</h1>
              <p className="text-md md:text-lg text-text-secondary mb-8 leading-relaxed">{slide.subtitle}</p>
              <Link 
                to={slide.link} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-sm transition-all duration-300 shadow-lg shadow-indigo-500/10 cursor-pointer"
              >
                {slide.cta} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
        
        {/* Slider Controls */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 border border-border-color bg-bg-dark/80 backdrop-blur-md rounded-sm hover:bg-white/5 transition-all duration-300 text-text-primary z-10 cursor-pointer"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 border border-border-color bg-bg-dark/80 backdrop-blur-md rounded-sm hover:bg-white/5 transition-all duration-300 text-text-primary z-10 cursor-pointer"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      {/* 2. Platform Impact in Numbers Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center justify-between bg-bg-card border border-border-color rounded-md p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Total Funds Raised</h3>
              <div className="text-3xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">24,800+</div>
            </div>
            <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
              <Coins size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg-card border border-border-color rounded-md p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Active Backers</h3>
              <div className="text-3xl font-extrabold font-display text-text-primary">1,420+</div>
            </div>
            <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-secondary/10 border border-secondary/20 text-secondary">
              <Users size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg-card border border-border-color rounded-md p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Countries Supported</h3>
              <div className="text-3xl font-extrabold font-display text-text-primary">14+</div>
            </div>
            <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-accent/10 border border-accent/20 text-accent">
              <Globe size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg-card border border-border-color rounded-md p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Fund Success Rate</h3>
              <div className="text-3xl font-extrabold font-display text-text-primary">94.8%</div>
            </div>
            <div className="w-12 h-12 rounded-sm flex items-center justify-center bg-warning/10 border border-warning/20 text-warning">
              <Zap size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full text-center flex flex-col gap-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-text-secondary text-sm">Support amazing campaigns or start raising funds in three quick steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4 bg-bg-card/40 border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
              <Compass size={28} />
            </div>
            <h3 className="text-lg font-bold">1. Explore Visionary Projects</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Browse through multiple categories including Technology, Art, Community and Health. Find projects that capture your heart.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 bg-bg-card/40 border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center bg-secondary/10 border border-secondary/20 text-secondary">
              <Heart size={28} />
            </div>
            <h3 className="text-lg font-bold">2. Contribute Platform Credits</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Top up your balance securely via Stripe, select a campaign, enter your contribution amount, and pledge your credits.
            </p>
          </div>

          <div className="flex flex-col items-center text-center gap-4 bg-bg-card/40 border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-sm flex items-center justify-center bg-accent/10 border border-accent/20 text-accent">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-lg font-bold">3. Project Success & Withdrawals</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Creators receive approval from the admin and withdraw their raised credits to dollar accounts based on the platform rules.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Top Funded Campaigns Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-12">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Top Funded Campaigns</h2>
          <p className="text-text-secondary text-sm">Visionary projects backed by our community of backers</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[250px]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : topCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center text-text-muted py-12">
            No campaigns have been approved yet. Check back soon!
          </div>
        )}
      </section>

      {/* 5. Explore by Category Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 w-full text-center flex flex-col gap-10">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-tight">Browse By Category</h2>
          <p className="text-text-secondary text-sm">Find campaigns in specific areas you care about</p>
        </div>
        
        <div className="flex gap-4 justify-center flex-wrap">
          {['Technology', 'Art', 'Community', 'Health'].map((category) => (
            <Link 
              key={category} 
              to={`/explore?category=${category}`} 
              className="px-8 py-4 border border-border-color bg-bg-card/50 text-text-primary text-md font-semibold rounded-md hover:border-primary hover:text-primary transition-all duration-300 min-w-[150px] text-center cursor-pointer shadow-lg hover:shadow-indigo-500/5"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Testimonial Section */}
      <section className="bg-[#0e0e12] border-y border-border-color py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight">Community Success Stories</h2>
            <p className="text-text-secondary text-sm">Listen to what our active backers and visionary creators say</p>
          </div>

          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
            <div className="bg-bg-card border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md text-center flex flex-col gap-6">
              <p className="text-lg italic text-text-primary leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <img 
                  src={testimonials[currentTestimonial].photo} 
                  alt={testimonials[currentTestimonial].name} 
                  className="w-12 h-12 rounded-full border border-border-color object-cover"
                />
                <div className="text-left">
                  <div className="text-sm font-bold text-text-primary">{testimonials[currentTestimonial].name}</div>
                  <div className="text-xs text-text-secondary">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            {/* Dots */}
            <div className="flex gap-2 justify-center mt-4">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-colors duration-300 ${currentTestimonial === idx ? 'bg-primary' : 'bg-white/20'}`}
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
