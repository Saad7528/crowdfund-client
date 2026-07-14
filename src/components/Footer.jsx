import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3 className="gradient-text">NovaFund</h3>
          <p>
            NovaFund is a futuristic crowdfunding ecosystem enabling Supporters to fuel visionary projects with platform credits. Connect, fund, and create change.
          </p>
          <div className="social-icons-row">
            <a href="https://github.com/s-m-amirulislamsaad" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com/in/s-m-amirulislamsaad" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul className="footer-links-list">
            <li><Link to="/explore" className="footer-link">Campaigns</Link></li>
            <li><Link to="/explore?category=Technology" className="footer-link">Technology</Link></li>
            <li><Link to="/explore?category=Art" className="footer-link">Art</Link></li>
            <li><Link to="/explore?category=Community" className="footer-link">Community</Link></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Platform</h4>
          <ul className="footer-links-list">
            <li><Link to="/login" className="footer-link">Sign In</Link></li>
            <li><Link to="/register" className="footer-link">Register</Link></li>
            <li><a href="https://github.com/s-m-amirulislamsaad/Crowdfunding-Platform-Client" className="footer-link">GitHub Repository</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Contact Us</h4>
          <ul className="footer-links-list">
            <li className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} /> support@novafund.com
            </li>
            <li className="footer-link">
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NovaFund Crowdfunding Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
