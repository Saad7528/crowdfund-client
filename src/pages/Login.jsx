import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const Login = () => {
  const { loginUser, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard or where the user was going before login
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await loginUser(email, password);
      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle('Supporter'); // Default Google login role
      setSuccess('Logged in with Google! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to manage campaigns and contributions</p>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setError(''); }} 
              className="form-input" 
              placeholder="e.g. john@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setError(''); }} 
              className="form-input" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={submitting}
          >
            {submitting ? <Loader size={20} className="modern-spinner" /> : 'Login'}
          </button>
        </form>

        <div className="auth-divider">or login using</div>

        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          <img src="https://lh3.googleusercontent.com/COxitDO2a0R3759y3aRHWd8wtYTy4aYpHg2_qI5et-89ZcQCvxPMHCvUr7gt351gH7Mr1J301wKe3VtAnL4vDJtZsL7ywDcTy8s" alt="Google" style={{ width: '18px', height: '18px' }} />
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" className="gradient-text" style={{ fontWeight: 600 }}>Register here</Link>
        </p>

        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-color)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>Default Admin Credentials:</strong><br />
          Email: <code style={{ color: 'var(--color-primary)' }}>admin@crowdfund.com</code><br />
          Password: <code style={{ color: 'var(--color-primary)' }}>adminPassword</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
