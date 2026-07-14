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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-bg-card border border-border-color rounded-md p-8 shadow-xl backdrop-blur-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold tracking-tight text-center font-display">Create Account</h2>
        <p className="text-sm text-text-secondary text-center -mt-2">Join NovaFund Crowdfunding Platform</p>

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
            <label className="text-xs font-semibold text-text-secondary">Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm" 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm" 
              placeholder="e.g. john@example.com"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm" 
              placeholder="••••••••"
              required 
            />
            <span className="text-[10px] text-text-muted">
              Min 6 characters, at least 1 uppercase and 1 special symbol.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Profile Image Upload (imgBB)</label>
            <div className="flex gap-3 items-center">
              <label className="px-4 py-2 border border-border-color bg-transparent text-text-primary text-xs font-semibold rounded-sm hover:bg-white/5 transition-all duration-300 flex items-center gap-1.5 cursor-pointer">
                <Upload size={16} /> Choose File
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <span className="text-xs text-text-secondary truncate max-w-[200px]">
                {imageFile ? imageFile.name : 'No file selected'}
              </span>
            </div>
            <div className="text-center text-[10px] uppercase text-text-muted my-1">or enter image link</div>
            <input 
              type="url" 
              name="photoURL" 
              value={formData.photoURL} 
              onChange={handleInputChange} 
              className="w-full px-4 py-2.5 bg-bg-input border border-border-color rounded-sm text-text-primary focus:outline-none focus:border-primary transition-all duration-300 text-sm disabled:opacity-50" 
              placeholder="https://example.com/avatar.jpg"
              disabled={!!imageFile}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleInputChange} 
              className="w-full px-3 py-2 bg-bg-input border border-border-color rounded-sm text-text-primary text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="Supporter">Supporter (Starts with 50 credits)</option>
              <option value="Creator">Creator (Starts with 20 credits)</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-sm transition-all duration-300 text-center cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            disabled={submitting || uploadingImage}
          >
            {(submitting || uploadingImage) ? <Loader size={18} className="animate-spin" /> : 'Register'}
          </button>
        </form>

        <div className="flex items-center justify-center my-2 text-[10px] uppercase tracking-wider text-text-muted before:content-[''] before:flex-1 before:h-px before:bg-border-color before:mr-4 after:content-[''] after:flex-1 after:h-px after:bg-border-color after:ml-4">
          or signup using
        </div>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <div id="google-signup-btn-container" className="flex justify-center mt-1 min-h-[40px]"></div>
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
          Already have an account? <Link to="/login" className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-semibold">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
