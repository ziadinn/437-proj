import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { usePosts } from '../hooks/usePosts';

export const Home: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { data, isLoading: postsLoading } = usePosts(1, 5);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to dashboard if authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const posts = data?.posts || [];

  const headerNav = (
    <div className="divide-x">
      <Link to="/login" className="text-accent text-decoration-none">
        Log in
      </Link>
      <Link to="/register" className="text-accent text-decoration-none">
        Sign up
      </Link>
    </div>
  );

  return (
    <Layout headerTitle="simple-blog-site" headerNav={headerNav}>
      <section className="welcome-section">
        <h1>Welcome to Simple Blog Site</h1>

        <p className="text-muted mb-1">
          A simple blogging platform where you can share your thoughts and read
          others' stories. {" "}
          <span style={{ fontSize: "0.5em" }}>
            (totally not a copy of Bear ʕ•ᴥ•ʔ)
          </span>
        </p>

        <div className="mb-2">
          <h2>Features</h2>
          <ul>
            <li>Write and publish blog posts</li>
            <li>Read posts from other writers</li>
            <li>Simple, clean interface</li>
            <li>User profiles and personal blogs</li>
          </ul>
        </div>

        {/* Recent Posts Section */}
        {!postsLoading && posts.length > 0 && (
          <div className="mb-2">
            <h2>Recent Posts</h2>
            {posts.slice(0, 3).map(post => (
              <div key={post._id} className="post-summary">
                <h3 style={{ marginBottom: '0.5rem' }}>
                  <Link to={`/post/${post._id}`} className="text-accent text-decoration-none">
                    {post.title}
                  </Link>
                </h3>
                <p style={{ 
                  color: 'var(--text-muted-color)', 
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem'
                }}>
                  By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p>
                  {post.description || (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            padding: "2rem 0",
            borderTop: "1px solid var(--border-color)",
            marginTop: "2rem",
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Ready to get started?</h3>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Link
              to="/register"
              className="button"
              style={{ textDecoration: "none" }}
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="button"
              style={{
                textDecoration: "none",
                backgroundColor: "transparent",
                border: "1px solid var(--primary-accent-color)",
                color: "var(--primary-accent-color)",
              }}
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
