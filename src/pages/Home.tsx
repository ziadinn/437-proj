import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PostSummary } from '../components/PostSummary';
import { usePostContext } from '../contexts/PostContext';
import { useProfileContext } from '../contexts/ProfileContext';
import { mockBlogStats } from '../data/mockData';

export const Home: React.FC = () => {
  const { posts } = usePostContext();
  const { profileImage } = useProfileContext();
  
  const headerNav = (
    <div className="divide-x">
      <Link to="/profile" className="text-accent text-decoration-none">Visit Profile</Link>
      <Link to="/edit-post" className="text-accent text-decoration-none">Create New Post</Link>
      <Link to="/settings" className="text-accent text-decoration-none">Settings</Link>
    </div>
  );

  return (
    <Layout headerNav={headerNav}>
      <section className="user-info">
        <div className="d-flex align-items-center mb-1">
          <div className="profile-icon">
            <img src={profileImage} alt="Profile Picture" className="profile-img" />
          </div>
          <nav className="divide-x">
            <Link to="/profile" className="text-accent text-decoration-none">Visit Profile</Link>
            <Link to="/edit-post" className="text-accent text-decoration-none">Create New Post</Link>
            <Link to="/settings" className="text-accent text-decoration-none">Settings</Link>
          </nav>
        </div>
      </section>

      <section className="home-feed">
        <h2>Home</h2>
        <p className="text-muted font-size-0_9">
          - Weekly posts views have gone up{' '}
          <span className="text-secondary-accent">{mockBlogStats.weeklyViewsIncrease}%</span>{' '}
          within the past week<br />
          - No unread comments
        </p>

        <h3>Recent Posts</h3>
        {posts.map(post => (
          <PostSummary key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
}; 