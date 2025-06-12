import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Comment } from '../components/Comment';
import { usePost, useDeletePost } from '../hooks/usePosts';
import { useAuth } from '../contexts/AuthContext';

export const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading: loading, error } = usePost(id || '');
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { user } = useAuth();

  const handleDeletePost = async () => {
    if (!post || !id) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmDelete) return;

    deletePost(id);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAuthor = user?.username === post?.author;

  const headerNav = (
    <Link to="/dashboard" className="text-accent text-decoration-none">Dashboard</Link>
  );

  if (loading) {
    return (
      <Layout headerNav={headerNav}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted-color)' }}>Loading post...</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout headerNav={headerNav}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Post not found</h2>
          <p style={{ color: 'var(--text-muted-color)', marginBottom: '1rem' }}>
            {error?.message || 'The post you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link to="/dashboard" className="button">
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout headerNav={headerNav}>
      <article className="blog-post">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              color: 'var(--text-muted-color)', 
              fontSize: '0.9rem',
              marginBottom: '1rem'
            }}>
              <span>By {post.author}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
              {post.createdAt !== post.updatedAt && (
                <>
                  <span>•</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
              <span>•</span>
              <span style={{ 
                padding: '2px 6px',
                backgroundColor: post.published ? '#28a745' : '#ffc107',
                color: post.published ? 'white' : '#000',
                borderRadius: '3px',
                fontSize: '0.8rem'
              }}>
                {post.published ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
          
          {isAuthor && (
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
              <Link 
                to={`/edit-post/${post._id}`} 
                className="button-secondary button-small"
              >
                Edit
              </Link>
              <button 
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="button-secondary button-small"
                style={{ 
                  borderColor: '#dc3545',
                  color: '#dc3545'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {post.description && (
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'var(--card-bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            marginBottom: '1.5rem'
          }}>
            <p style={{ 
              margin: 0,
              fontStyle: 'italic',
              color: 'var(--text-muted-color)'
            }}>
              {post.description}
            </p>
          </div>
        )}

        <div style={{ 
          lineHeight: '1.7',
          fontSize: '1rem',
          whiteSpace: 'pre-wrap'
        }}>
          {post.content}
        </div>
      </article>

      <section className="comments-section">
        <h3>Comments</h3>
        <p style={{ color: 'var(--text-muted-color)', fontStyle: 'italic' }}>
          Comments feature coming soon!
        </p>
      </section>
    </Layout>
  );
}; 