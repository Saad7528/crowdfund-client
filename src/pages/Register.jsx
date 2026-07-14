import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { AlertCircle, CheckCircle, Upload, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

const Register = () => {
  const { createUser, loginWithGoogle } = useContext(AuthContext);
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

        <button onClick={handleGoogleSignIn} className="google-signin-btn">
          <img src="https://lh3.googleusercontent.com/COxitDO2a0R3759y3aRHWd8wtYTy4aYpHg2_qI5et-89ZcQCvxPMHCvUr7gt351gH7Mr1J301wKe3VtAnL4vDJtZsL7ywDcTy8s" alt="Google" style={{ width: '18px', height: '18px' }} />
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" className="gradient-text" style={{ fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
