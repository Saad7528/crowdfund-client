import React, { Component } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-glow"></div>
          
          <div className="error-boundary-content">
            <div className="error-icon-wrapper">
              <AlertOctagon size={64} className="anomaly-pulse" />
            </div>

            <h1 className="error-title">System Anomaly</h1>
            <p className="error-subtitle">
              An unexpected engine failure occurred in the application module.
            </p>

            <div className="error-details-box">
              <p className="error-message">
                {this.state.error?.message || "Unknown Application Crash"}
              </p>
            </div>

            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-primary error-btn">
                <RefreshCw size={18} /> Restart Module
              </button>
              <a href="/" className="btn-secondary error-btn">
                <Home size={18} /> Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
