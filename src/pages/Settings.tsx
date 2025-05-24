import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { mockUser } from '../data/mockData';

export const Settings: React.FC = () => {
  const [username, setUsername] = useState(mockUser.username);
  const [bio, setBio] = useState(mockUser.bio);
  const [visibility, setVisibility] = useState('public');
  const [theme, setTheme] = useState('dark');

  const headerNav = (
    <>
      <Link to="/" className="text-accent text-decoration-none">Home</Link>
      <Link to="/profile" className="text-accent text-decoration-none ml-0_5">Profile</Link>
    </>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Settings saved:', { username, bio, visibility, theme });
  };

  return (
    <Layout headerNav={headerNav}>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="profile-description">Profile Description</label>
          <textarea 
            id="profile-description" 
            name="profile-description"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Blog Visibility</label>
          <input 
            type="radio" 
            id="visibility-public" 
            name="visibility" 
            value="public" 
            checked={visibility === 'public'}
            onChange={(e) => setVisibility(e.target.value)}
          />
          <label htmlFor="visibility-public" className="radio-label-mr">Public</label>
          <input 
            type="radio" 
            id="visibility-private" 
            name="visibility" 
            value="private"
            checked={visibility === 'private'}
            onChange={(e) => setVisibility(e.target.value)}
          />
          <label htmlFor="visibility-private" className="radio-label">Private</label>
        </div>
        
        <div className="form-group">
          <label>Theme</label>
          <input 
            type="radio" 
            id="theme-dark" 
            name="theme" 
            value="dark" 
            checked={theme === 'dark'}
            onChange={(e) => setTheme(e.target.value)}
          />
          <label htmlFor="theme-dark" className="radio-label-mr">Dark</label>
          <input 
            type="radio" 
            id="theme-light" 
            name="theme" 
            value="light"
            checked={theme === 'light'}
            onChange={(e) => setTheme(e.target.value)}
          />
          <label htmlFor="theme-light" className="radio-label">Light</label>
        </div>
        
        <button type="submit" className="button">Save Settings</button>
      </form>
    </Layout>
  );
}; 