import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { PlusCircle, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';

const AddCampaign = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    campaign_story: '',
    category: 'Technology',
    funding_goal: '',
    minimum_contribution: '',
    deadline: '',
    reward_info: '',
    campaign_image_url: ''
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

  // Upload to imgBB
  const uploadToImgBB = async (file) => {
    if (!IMGBB_KEY || IMGBB_KEY === 'placeholder_imgbb_key') {
      console.warn("imgBB API key is missing. Using default placeholder image.");
      return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
    }

    const body = new FormData();
    body.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: 'POST',
      body: body
    });

    if (!res.ok) {
      throw new Error("Failed to upload campaign image to imgBB");
    }

    const data = await res.json();
    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const { title, campaign_story, funding_goal, minimum_contribution, deadline, reward_info } = formData;
    if (!title || !campaign_story || !funding_goal || !minimum_contribution || !deadline || !reward_info) {
      setError('Please fill in all required fields.');
      return;
    }

    if (Number(funding_goal) <= 0 || Number(minimum_contribution) <= 0) {
      setError('Funding goal and minimum contribution must be positive numbers.');
      return;
    }

    if (new Date(deadline) <= new Date()) {
      setError('Deadline must be a future date.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('access-token');

    try {
      let uploadedUrl = formData.campaign_image_url;

      // Upload file to imgBB if selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          uploadedUrl = await uploadToImgBB(imageFile);
        } catch (imgErr) {
          console.error("Image upload failed:", imgErr);
          setError("Failed to upload image. Using direct URL input if provided.");
        } finally {
          setUploadingImage(false);
        }
      }

      if (!uploadedUrl) {
        uploadedUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
      }

      const campaignData = {
        ...formData,
        campaign_image_url: uploadedUrl,
        creator_name: user.name
      };

      const response = await fetch(`${API_URL}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaignData)
      });

      if (response.ok) {
        setSuccess('Campaign submitted successfully! Awaiting Admin approval.');
        setTimeout(() => {
          navigate('/dashboard/my-campaigns');
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit campaign.');
      }

    } catch (err) {
      console.error(err);
      setError('Server error creating campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Launch New Campaign</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Create and pitch your idea. Admin will review and approve it for backing.</p>

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

      <form onSubmit={handleSubmit} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Campaign Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            className="form-input" 
            placeholder="e.g. Help us build a solar-powered water pump"
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleInputChange} 
            className="form-select"
          >
            <option value="Technology">Technology</option>
            <option value="Art">Art</option>
            <option value="Community">Community</option>
            <option value="Health">Health</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="stats-grid">
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Funding Goal (Credits)</label>
            <input 
              type="number" 
              name="funding_goal" 
              value={formData.funding_goal} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="e.g. 5000"
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Minimum Pledge (Credits)</label>
            <input 
              type="number" 
              name="minimum_contribution" 
              value={formData.minimum_contribution} 
              onChange={handleInputChange} 
              className="form-input" 
              placeholder="e.g. 50"
              required 
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Campaign Story</label>
          <textarea 
            name="campaign_story" 
            value={formData.campaign_story} 
            onChange={handleInputChange} 
            className="form-textarea" 
            placeholder="Describe your story, project goals, and what the funds will accomplish..."
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Reward Information for Backers</label>
          <input 
            type="text" 
            name="reward_info" 
            value={formData.reward_info} 
            onChange={handleInputChange} 
            className="form-input" 
            placeholder="e.g. Free early access beta product + custom stickers"
            required 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="stats-grid">
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Funding Deadline</label>
            <input 
              type="date" 
              name="deadline" 
              value={formData.deadline} 
              onChange={handleInputChange} 
              className="form-input" 
              required 
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Campaign Cover Image Upload</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', height: '46px' }}>
              <label className="btn btn-secondary" style={{ padding: '10px 15px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <Upload size={16} /> Upload Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {imageFile ? imageFile.name : 'No file chosen'}
              </span>
            </div>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '0' }}>
          <label className="form-label">Or Image URL</label>
          <input 
            type="url" 
            name="campaign_image_url" 
            value={formData.campaign_image_url} 
            onChange={handleInputChange} 
            className="form-input" 
            placeholder="https://example.com/cover-image.jpg"
            disabled={!!imageFile}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '14px', marginTop: '10px' }}
          disabled={submitting || uploadingImage}
        >
          {submitting ? 'Submitting Campaign...' : 'Add Campaign'}
        </button>

      </form>
    </div>
  );
};

export default AddCampaign;
