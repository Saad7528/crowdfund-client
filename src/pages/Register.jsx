import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { AlertCircle, CheckCircle, Upload, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

const Register = () => {
  const { createUser, loginWithGoogle, loginWithGoogleCredential } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoURL: '',
    role: 'Supporter'
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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
            await loginWithGoogleCredential(response.credential, formData.role);
            setSuccess('Registered and logged in with Google! Redirecting...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          } catch (err) {
            setError(err.message || 'Google Sign-In failed.');
            setSubmitting(false);
          }
        }
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn-container"),
        { theme: "filled_black", size: "large", width: 340 }
      );
    }
  }, [navigate, formData.role, loginWithGoogleCredential]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setError('');
  };

  // Input validation
  const validateInputs = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    // Password strength check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasCapital || !hasSpecial) {
      setError('Password must contain at least one uppercase letter and one special character.');
      return false;
    }

    return true;
  };

  // Upload image to imgBB
  const uploadToImgBB = async (file) => {
    if (!IMGBB_KEY || IMGBB_KEY === 'placeholder_imgbb_key') {
      console.warn("imgBB API key is missing. Using default avatar.");
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
    }

    const body = new FormData();
    body.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: 'POST',
      body: body
    });

    if (!res.ok) {
      throw new Error("Failed to upload image to imgBB");
    }

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setSubmitting(true);
    setError('');

    try {
      // Check if email already exists in backend
      const checkRes = await fetch(`${API_URL}/users/check/${formData.email}`);
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setError('An account with this email already exists.');
          setSubmitting(false);
          return;
        }
      }

      let uploadedUrl = formData.photoURL;

      if (imageFile) {
        setUploadingImage(true);
        try {
          uploadedUrl = await uploadToImgBB(imageFile);
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          setError("Failed to upload profile picture. Using standard text field value if provided.");
        } finally {
          setUploadingImage(false);
        }
      }

      if (!uploadedUrl) {
        uploadedUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200';
      }

      await createUser(
        formData.name,
        formData.email,
        formData.password,
        uploadedUrl,
        formData.role
      );

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle(formData.role);
      setSuccess('Logged in with Google! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join NovaFund Crowdfunding Platform</p>

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
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="e.g. john@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="••••••••"
              required 
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
              Min 6 characters, at least 1 uppercase and 1 special symbol.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Profile Image Upload (imgBB)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label className="btn btn-secondary" style={{ padding: '10px 15px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <Upload size={16} /> Choose File
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {imageFile ? imageFile.name : 'No file selected'}
              </span>
            </div>
            <div style={{ margin: '12px 0 6px 0', textSelf: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>or enter image link</div>
            <input 
              type="url" 
              name="photoURL" 
              value={formData.photoURL} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="https://example.com/avatar.jpg"
              disabled={!!imageFile}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleInputChange} 
              className="form-select"
            >
              <option value="Supporter">Supporter (Starts with 50 credits)</option>
              <option value="Creator">Creator (Starts with 20 credits)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            disabled={submitting || uploadingImage}
          >
            {(submitting || uploadingImage) ? <Loader size={20} className="modern-spinner" /> : 'Register'}
          </button>
        </form>

        <div className="auth-divider">or signup using</div>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div id="google-signup-btn-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', minHeight: '40px' }}></div>
        ) : (
          <button onClick={handleGoogleSignIn} className="google-signin-btn">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="gradient-text" style={{ fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
