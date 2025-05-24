import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PostSummary } from '../components/PostSummary';
import { usePostContext } from '../contexts/PostContext';
import { mockUser } from '../data/mockData';

export const Profile: React.FC = () => {
  const { posts } = usePostContext();
  
  const headerNav = (
    <>
      <Link to="/" className="text-accent text-decoration-none">Home</Link>
      <Link to="/settings" className="text-accent text-decoration-none ml-0_5">Settings</Link>
    </>
  );

  return (
    <Layout 
      headerTitle={`simple-blog.com/${mockUser.username}`}
      headerNav={headerNav}
    >
      <section className="profile-header d-flex align-items-center mb-2">
        <div className="profile-icon">
          <img src={mockUser.profileImage} alt="Profile Picture" className="profile-img" />
        </div>
        <div>
          <h2>About</h2>
          <p className="text-muted font-size-0_9">{mockUser.bio}</p>
        </div>
      </section>

      <section className="user-posts">
        <h3>Recent Posts</h3>
        {posts.filter(post => post.author === mockUser.username).map(post => (
          <PostSummary key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
}; 