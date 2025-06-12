import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/PostCard'

export const Home: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data, isLoading: postsLoading, error } = usePosts(1, 10)

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted-color)' }}>Loading...</p>
        </div>
      </Layout>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (postsLoading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted-color)' }}>Loading posts...</p>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#ff4444', marginBottom: '1rem' }}>Error loading posts: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="button"
          >
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  const posts = data?.posts || []

  const headerNav = (
    <div className="divide-x">
      <Link to="/login" className="text-accent text-decoration-none">Login</Link>
      <Link to="/register" className="text-accent text-decoration-none">Register</Link>
    </div>
  );

  return (
    <Layout headerTitle="simple-blog-site" headerNav={headerNav}>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome to BlogApp
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted-color)', marginBottom: '2rem' }}>
          Discover amazing stories and share your own
        </p>
        <Link 
          to="/register" 
          className="button"
          style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
        >
          Get Started
        </Link>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Latest Posts</h2>
        
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: 'var(--text-muted-color)', fontSize: '1.1rem' }}>No posts available yet.</p>
            <p style={{ color: 'var(--text-muted-color)', marginTop: '0.5rem' }}>Be the first to share your story!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>

      {posts.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link 
            to="/posts" 
            className="button-secondary"
          >
            View All Posts
          </Link>
        </div>
      )}
    </Layout>
  );
};
