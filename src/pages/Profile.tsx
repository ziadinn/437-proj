import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { PostSummary } from "../components/PostSummary";
import { NoPostsMessage } from "../components/NoPostsMessage";
import { usePostContext } from "../contexts/PostContext";
import { useAuthContext } from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const { posts } = usePostContext();
  const { user } = useAuthContext();

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
        <div>
          <h2>About</h2>
          <p className="text-muted font-size-0_9">
            {user?.description || 'No description yet. Add one in your settings!'}
          </p>
        </div>
      </section>

      <section className="user-posts">
        <h3>Recent Posts</h3>
        {posts.length === 0 ? (
          <NoPostsMessage />
        ) : (
          posts.map((post) => (
            <PostSummary key={post.id} post={post} />
          ))
        )}
      </section>
    </Layout>
  );
};
