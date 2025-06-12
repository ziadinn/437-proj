import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuthContext } from "../contexts/AuthContext";
import { useProfileContext } from "../contexts/ProfileContext";

// Import User type for TypeScript
interface User {
  username: string;
  description: string;
  profileImageBase64?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Settings: React.FC = () => {
  const { user, updateProfile: updateUserProfile } = useAuthContext();
  const { theme, updateProfile: updateTheme } = useProfileContext();
  
  const [username, setUsername] = useState(user?.username || '');
  const [description, setDescription] = useState(user?.description || '');
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  const navigate = useNavigate();

  // Sync local state with user context when it changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDescription(user.description);
    }
  }, [user]);

  // Sync theme state
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  // Handle image file selection
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type (JPEG only)
    if (file.type !== 'image/jpeg') {
      setMessage('Please select a JPEG image file.');
      setMessageType('error');
      return;
    }

    // Validate file size (1MB max)
    if (file.size > 1048576) {
      setMessage('Image file must be smaller than 1MB.');
      setMessageType('error');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setImagePreview(base64String);
      setMessage('');
    };
    reader.onerror = () => {
      setMessage('Error reading image file.');
      setMessageType('error');
    };
    reader.readAsDataURL(file);
  };

  // Remove current profile image
  const handleRemoveCurrentImage = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const success = await updateUserProfile({ profileImageBase64: '' });
      
      if (success) {
        setMessage('Profile picture removed successfully!');
        setMessageType('success');
      } else {
        setMessage('Failed to remove profile picture. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Remove image error:', error);
      setMessage('An error occurred while removing profile picture.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const headerNav = (
    <>
      <div className="divide-x">
        <Link to="/dashboard" className="text-accent text-decoration-none">
          Dashboard
        </Link>
        <Link to="/profile" className="text-accent text-decoration-none">
          Profile
        </Link>
      </div>
    </>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Update theme locally (this persists automatically via ProfileContext)
      if (selectedTheme !== theme) {
        updateTheme({ theme: selectedTheme });
      }

      // Check if profile data actually changed and build update object
      const updates: Partial<Pick<User, 'username' | 'description' | 'profileImageBase64'>> = {};
      
      if (username !== user?.username) {
        updates.username = username;
      }
      
      if (description !== user?.description) {
        updates.description = description;
      }

      if (imagePreview) {
        updates.profileImageBase64 = imagePreview;
      }
      
      // Only make API call if something actually changed
      if (Object.keys(updates).length > 0) {
        // Update profile via backend API
        const success = await updateUserProfile(updates);
        
        if (success) {
          setMessage('Settings saved successfully!');
          setMessageType('success');
          // Clear image preview after successful upload
          setImagePreview('');
        } else {
          setMessage('Failed to update profile. Please try again.');
          setMessageType('error');
        }
      } else {
        setMessage('Settings saved successfully!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('An error occurred while saving settings.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      setUsername(user.username);
      setDescription(user.description);
    }
    setSelectedTheme(theme);
    setMessage('');
    navigate('/dashboard');
  };

  return (
    <Layout headerNav={headerNav}>
      <h2>Settings</h2>
      
      {message && (
        <div className={`message ${messageType === 'error' ? 'error' : 'success'}`} style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          backgroundColor: messageType === 'error' ? '#ffebee' : '#e8f5e8',
          color: messageType === 'error' ? '#c62828' : '#2e7d32',
          border: `1px solid ${messageType === 'error' ? '#ffcdd2' : '#c8e6c9'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="profileImage">Profile Picture</label>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            {/* Current Profile Image */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-color-secondary)' }}>
                Current
              </div>
              {user?.profileImageBase64 ? (
                <>
                  <img
                    src={user.profileImageBase64}
                    alt="Current Profile"
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-color)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    disabled={isLoading}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      backgroundColor: 'transparent',
                      color: 'var(--text-color-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-color-secondary)',
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    border: '2px solid var(--border-color)'
                  }}
                >
                  {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
              )}
            </div>

            {/* Image Preview (if new image selected) */}
            {imagePreview && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-color-secondary)' }}>
                  Preview
                </div>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--primary-accent-color)'
                  }}
                />
              </div>
            )}
          </div>
          
          <input
            type="file"
            id="profileImage"
            accept="image/jpeg"
            onChange={handleImageUpload}
            disabled={isLoading}
            style={{ marginTop: '0.75rem' }}
          />
          <small style={{ color: 'var(--text-color-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
            JPEG images only, maximum 1MB
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            disabled={isLoading}
          />
          <small style={{ color: 'var(--text-color-secondary)', fontSize: '0.8rem' }}>
            Must be at least 3 characters long
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Profile Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="form-group">
          <fieldset>
            <legend>Theme</legend>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="theme-dark"
                  name="theme"
                  value="dark"
                  checked={selectedTheme === "dark"}
                  onChange={(e) => setSelectedTheme(e.target.value as "dark" | "light")}
                  disabled={isLoading}
                />
                <label htmlFor="theme-dark">Dark</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="theme-light"
                  name="theme"
                  value="light"
                  checked={selectedTheme === "light"}
                  onChange={(e) => setSelectedTheme(e.target.value as "dark" | "light")}
                  disabled={isLoading}
                />
                <label htmlFor="theme-light">Light</label>
              </div>
            </div>
          </fieldset>
        </div>

        <div className="form-actions" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button 
            type="submit" 
            className="button" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
          <button 
            type="button" 
            className="button" 
            onClick={handleCancel}
            disabled={isLoading}
            style={{ 
              backgroundColor: 'transparent', 
              color: 'var(--text-color-secondary)',
              border: '1px solid var(--text-color-secondary)'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
};
