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
        <div className="relative min-h-screen flex justify-center items-center p-6 md:p-10 bg-bg-dark overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-radial from-danger/10 to-transparent blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-lg w-full text-center bg-bg-card border border-danger/20 rounded-md p-10 md:p-12 shadow-2xl backdrop-blur-md">
            <div className="inline-flex justify-center items-center w-20 h-20 bg-danger/10 border border-danger/30 rounded-full text-danger mb-6 red-pulse-anim">
              <AlertOctagon size={48} />
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-danger mb-2 font-display">System Anomaly</h1>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              An unexpected engine failure occurred in the application module.
            </p>

            <div className="bg-black/30 border border-border-color rounded-sm p-4 text-left mb-8">
              <p className="font-mono text-xs text-danger/80 break-all">
                {this.state.error?.message || "Unknown Application Crash"}
              </p>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={this.handleReset} 
                className="px-6 py-3 bg-danger hover:bg-danger/85 text-white text-sm font-semibold rounded-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-danger/10"
              >
                <RefreshCw size={18} /> Restart Module
              </button>
              <a 
                href="/" 
                className="px-6 py-3 border border-border-color bg-transparent text-text-primary text-sm font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
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
