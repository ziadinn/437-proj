import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, Profile, Post, Settings, EditPost } from './pages';
import { PostProvider } from './contexts/PostContext';
import './style.css';

function App() {
  return (
    <PostProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-post" element={<EditPost />} />
        </Routes>
      </Router>
    </PostProvider>
  );
}

export default App;
