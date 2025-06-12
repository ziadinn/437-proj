import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { NoPostsMessage } from "../components/NoPostsMessage";
import { useMyPosts } from "../hooks/usePosts";
import { useAuthContext } from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const { user } = useAuthContext();
  const { data: posts = [], isLoading: loading, error } = useMyPosts();

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
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  };

  const headerNav = (
    <>
      <div className="divide-x">
        <Link to="/dashboard" className="text-accent text-decoration-none">
          Dashboard
        </Link>
        <Link to="/settings" className="text-accent text-decoration-none">
          Settings
        </Link>
      </div>
    </>
  );

  return (
    <Layout headerTitle={`simple-blog.com/${user?.username || ''}`} headerNav={headerNav}>
      <section className="profile-header d-flex align-items-center mb-2">
        {user?.profileImageBase64 ? (
          <img
            src={user.profileImageBase64}
            alt="Profile Picture"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: '1rem',
              flexShrink: 0,
              border: '2px solid var(--border-color)'
            }}
          />
        ) : (
          <div 
            className="profile-placeholder"
            style={{
              backgroundColor: 'var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-color-secondary)',
              fontSize: '1.75rem',
              fontWeight: 'bold',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              marginRight: '1rem',
              flexShrink: 0
            }}
          >
            {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <div>
          <h2>About</h2>
          <p className="text-muted font-size-0_9">
            {user?.description || 'No description yet. Add one in your settings!'}
          </p>
        </div>
      </section>

      <section className="user-posts">
        <h3>Your Posts</h3>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ff4444', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '1rem' 
          }}>
            Error loading posts: {error.message}
          </div>
        )}
        
        {loading ? (
          <p style={{ color: 'var(--text-muted-color)' }}>Loading your posts...</p>
        ) : posts.length === 0 ? (
          <NoPostsMessage />
        ) : (
          <div>
            <p style={{ color: 'var(--text-muted-color)', marginBottom: '1rem' }}>
              You have {posts.length} published post{posts.length !== 1 ? 's' : ''}.
            </p>
            {posts.map((post) => (
              <div key={post._id} className="post-summary" style={{ 
                marginBottom: '2rem',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--background-secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
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
                <p style={{ color: 'var(--text-muted-color)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                  {getPostExcerpt(post.content, post.description)}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  color: 'var(--text-muted-color)', 
                  fontSize: '0.85rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '0.75rem'
                }}>
                  <span>Published: {formatDate(post.createdAt)}</span>
                  <span>Last updated: {formatDate(post.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};
