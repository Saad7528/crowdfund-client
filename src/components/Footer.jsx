import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0e0e12] border-t border-border-color pt-16 pb-8 px-4 md:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-extrabold font-display">NovaFund</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            NovaFund is a futuristic crowdfunding ecosystem enabling Supporters to fuel visionary projects with platform credits. Connect, fund, and create change.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://github.com/s-m-amirulislamsaad" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-border-color rounded-sm text-text-secondary hover:text-primary hover:border-primary transition-all duration-300" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://linkedin.com/in/s-m-amirulislamsaad" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-border-color rounded-sm text-text-secondary hover:text-primary hover:border-primary transition-all duration-300" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-border-color rounded-sm text-text-secondary hover:text-primary hover:border-primary transition-all duration-300" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center border border-border-color rounded-sm text-text-secondary hover:text-primary hover:border-primary transition-all duration-300" title="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-wider text-text-primary uppercase">Explore</h4>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
            <li><Link to="/explore" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Campaigns</Link></li>
            <li><Link to="/explore?category=Technology" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Technology</Link></li>
            <li><Link to="/explore?category=Art" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Art</Link></li>
            <li><Link to="/explore?category=Community" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Community</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-wider text-text-primary uppercase">Platform</h4>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
            <li><Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Sign In</Link></li>
            <li><Link to="/register" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">Register</Link></li>
            <li><a href="https://github.com/Saad7528/crowdfund-client" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300">GitHub Repository</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold tracking-wider text-text-primary uppercase">Contact Us</h4>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
            <li className="text-sm text-text-secondary flex items-center gap-2">
              <Mail size={16} /> support@novafund.com
            </li>
            <li className="text-sm text-text-secondary">
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-border-color mt-16 pt-8 text-center text-xs text-text-muted">
        <p>&copy; {new Date().getFullYear()} NovaFund Crowdfunding Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
