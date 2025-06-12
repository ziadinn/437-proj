import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Profile, Post, Settings, EditPost, Login, Register, Dashboard } from './pages';
import { PostProvider } from './contexts/PostContext';
import { ProfileProvider, useProfileContext } from './contexts/ProfileContext';
import { AuthProvider } from './contexts/AuthContext';
import { PostsProvider } from './contexts/PostsContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './style.css';

function AppContent() {
  const { theme } = useProfileContext();

  useEffect(() => {
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <PostProvider>
      <PostsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/edit-post" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
            <Route path="/edit-post/:postId" element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </PostsProvider>
    </PostProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
