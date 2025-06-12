import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { NoPostsMessage } from '../components/NoPostsMessage';
import { usePostsContext } from '../contexts/PostsContext';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { posts, loading, error, getPostsByUser, clearError } = usePostsContext();
  const { user, logout } = useAuth();

  // Load user's posts when component mounts
  useEffect(() => {
    if (user?.username) {
      const loadUserPosts = async () => {
        await getPostsByUser(user.username);
      };
      loadUserPosts();
    }
  }, [user?.username, getPostsByUser]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogout = () => {
    logout();
    // Navigation to home will happen automatically
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPostExcerpt = (content: string, description?: string) => {
    if (description) return description;
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
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
            <Link to="/edit-post" className="button">
              Create New Post
            </Link>
            <Link to="/profile" className="button-secondary">
              View Profile
            </Link>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3>Your Posts</h3>
          
          {error && (
            <div style={{ 
              backgroundColor: '#ff4444', 
              color: 'white', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '1rem' 
            }}>
              Error loading posts: {error}
            </div>
          )}
          
          {loading ? <p style={{ color: 'var(--text-muted-color)' }}>Loading your posts...</p> : null}

          {!loading && !error && posts.length === 0 ? <NoPostsMessage /> : null}

          {!loading && !error && posts.length > 0 ? (
            <div>
              <p style={{ color: 'var(--text-muted-color)', marginBottom: '1rem' }}>
                You have {posts.length} post{posts.length !== 1 ? 's' : ''}.
              </p>
              {posts.slice(0, 5).map(post => (
                <div key={post._id} className="post-summary" style={{ 
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--background-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', flex: 1 }}>
                      <Link to={`/post/${post._id}`} className="text-accent text-decoration-none">
                        {post.title}
                      </Link>
                    </h4>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <Link 
                        to={`/edit-post/${post._id}`} 
                        className="button-secondary button-small"
                      >
                        Edit
                      </Link>
                      <span style={{ 
                        fontSize: '0.8rem',
                        padding: '4px 8px',
                        backgroundColor: post.published ? '#28a745' : '#ffc107',
                        color: post.published ? 'white' : '#000',
                        borderRadius: '3px'
                      }}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {getPostExcerpt(post.content, post.description)}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    color: 'var(--text-muted-color)', 
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                  }}>
                    <span>Created: {formatDate(post.createdAt)}</span>
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  </div>
                </div>
              ))}
              {posts.length > 5 && (
                <Link to="/profile" className="text-accent text-decoration-none">
                  View all {posts.length} posts →
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  );
}; 