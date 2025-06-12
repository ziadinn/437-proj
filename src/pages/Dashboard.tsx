import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { NoPostsMessage } from '../components/NoPostsMessage';
import { usePostContext } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { posts } = usePostContext();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Navigation to home will happen automatically
  };

  const headerNav = (
    <div className="divide-x">
      <Link to="/profile" className="text-accent text-decoration-none">Profile</Link>
      <Link to="/edit-post" className="text-accent text-decoration-none">Write Post</Link>
      <Link to="/settings" className="text-accent text-decoration-none">Settings</Link>
      {/* too lazy to update css, but check `header nav a` for the style */}
      <button 
        onClick={handleLogout}
        className="text-accent text-decoration-none"
        style={{ 
          background: 'none', 
          border: 'none',
          borderBottom: 'none',
          borderRight: 'none',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          fontSize: '0.9rem',
          color: 'var(--primary-accent-color)'
        }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <Layout headerTitle="simple-blog-site" headerNav={headerNav}>
      <section className="dashboard">
        <h1 style={{ marginBottom: '2rem' }}>
          Welcome back, {user?.username}!
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3>Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Link to="/edit-post" className="button" style={{ textDecoration: 'none' }}>
              Create New Post
            </Link>
            <Link to="/profile" className="button" style={{ 
              textDecoration: 'none',
              backgroundColor: 'transparent',
              border: '1px solid var(--primary-accent-color)',
              color: 'var(--primary-accent-color)'
            }}>
              View Profile
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Your Posts</h3>
          {posts.length === 0 ? (
            <NoPostsMessage />
          ) : (
            <div>
              <p style={{ color: 'var(--text-muted-color)', marginBottom: '1rem' }}>
                You have {posts.length} post{posts.length !== 1 ? 's' : ''}.
              </p>
              {posts.slice(0, 3).map(post => (
                <div key={post.id} className="post-summary">
                  <h4 style={{ marginBottom: '0.5rem' }}>
                    <Link to={`/post/${post.id}`} className="text-accent text-decoration-none">
                      {post.title}
                    </Link>
                  </h4>
                  <p style={{ color: 'var(--text-muted-color)', fontSize: '0.9rem' }}>
                    {post.excerpt || post.content.substring(0, 100)}...
                  </p>
                  <p style={{ 
                    color: 'var(--text-muted-color)', 
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                  }}>
                    {post.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {posts.length > 3 && (
                <Link to="/profile" className="text-accent text-decoration-none">
                  View all posts →
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}; 