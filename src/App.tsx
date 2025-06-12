import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Profile, Post, Settings, EditPost, Login, Register, Dashboard } from './pages';
import { PostProvider } from './contexts/PostContext';
import { ProfileProvider, useProfileContext } from './contexts/ProfileContext';
import './style.css';

function AppContent() {
  const { theme } = useProfileContext();

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <PostProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-post" element={<EditPost />} />
        </Routes>
      </Router>
    </PostProvider>
  );
}

function App() {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  );
}

export default App;
