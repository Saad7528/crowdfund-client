import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const Login = () => {
  const { loginUser, loginWithGoogle, loginWithGoogleCredential } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard or where the user was going before login
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          setSubmitting(true);
          setError('');
          try {
            await loginWithGoogleCredential(response.credential, 'Supporter');
            setSuccess('Logged in with Google! Redirecting...');
            setTimeout(() => {
              navigate(from, { replace: true });
            }, 1200);
          } catch (err) {
            setError(err.message || 'Google Sign-In failed.');
            setSubmitting(false);
          }
        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn-container"),
        { theme: "filled_black", size: "large", width: 340 }
      );
    }
  }, [navigate, from, loginWithGoogleCredential]);

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-bg-card border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight text-center font-display">Welcome Back</h2>
        <p className="text-sm text-text-secondary text-center -mt-2">Sign in to manage campaigns and contributions</p>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-danger/10 border-danger/20 text-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-sm border text-xs bg-accent/10 border-accent/20 text-accent">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => { setEmail(e.target.value); setError(''); }} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm" 
              placeholder="e.g. john@example.com"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setError(''); }} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm" 
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 text-center cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? <Loader size={18} className="animate-spin" /> : 'Login'}
          </button>
        </form>

        <div className="flex items-center justify-center my-2 text-[10px] uppercase tracking-wider text-text-muted before:content-[''] before:flex-1 before:h-px before:bg-border-color before:mr-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color after:ml-4">
          or login using
        </div>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div id="google-signin-btn-container" className="flex justify-center mt-1 min-h-[40px]"></div>
        ) : (
          <button onClick={handleGoogleSignIn} className="w-full py-2.5 border border-border-color bg-transparent text-text-primary font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        )}

        <p className="text-center text-sm text-text-secondary">
          Don't have an account? <Link to="/register" className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-semibold">Register here</Link>
        </p>

        {/* <div className="mt-4 p-4 bg-white/2 border border-dashed border-border-color rounded-sm text-xs text-text-secondary flex flex-col gap-1 leading-relaxed">
          <strong>Default Admin Credentials:</strong>
          <span>Email: <code className="text-primary">admin@crowdfund.com</code></span>
          <span>Password: <code className="text-primary">adminPassword</code></span>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
