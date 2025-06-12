import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuthContext } from "../contexts/AuthContext";
import { useProfileContext } from "../contexts/ProfileContext";

// Import User type for TypeScript
interface User {
  username: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Settings: React.FC = () => {
  const { user, updateProfile: updateUserProfile } = useAuthContext();
  const { theme, updateProfile: updateTheme } = useProfileContext();
  
  const [username, setUsername] = useState(user?.username || '');
  const [description, setDescription] = useState(user?.description || '');
  const [selectedTheme, setSelectedTheme] = useState(theme);
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
      const updates: Partial<Pick<User, 'username' | 'description'>> = {};
      
      if (username !== user?.username) {
        updates.username = username;
      }
      
      if (description !== user?.description) {
        updates.description = description;
      }
      
      // Only make API call if something actually changed
      if (Object.keys(updates).length > 0) {
        // Update profile via backend API
        const success = await updateUserProfile(updates);
        
        if (success) {
          setMessage('Settings saved successfully!');
          setMessageType('success');
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
