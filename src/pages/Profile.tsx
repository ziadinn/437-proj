import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { PostSummary } from "../components/PostSummary";
import { usePostContext } from "../contexts/PostContext";
import { useProfileContext } from "../contexts/ProfileContext";

export const Profile: React.FC = () => {
  const { posts } = usePostContext();
  const { username, bio, profileImage } = useProfileContext();

  const headerNav = (
    <>
      <div className="divide-x">
        <Link to="/" className="text-accent text-decoration-none">
          Home
        </Link>
        <Link
          to="/settings"
          className="text-accent text-decoration-none"
        >
          Settings
        </Link>
      </div>
    </>
  );

  return (
    <Layout headerTitle={`simple-blog.com/${username}`} headerNav={headerNav}>
      <section className="profile-header d-flex align-items-center mb-2">
        <div className="profile-icon">
          <img
            src={profileImage}
            alt="Profile Picture"
            className="profile-img"
          />
        </div>
        <div>
          <h2>About</h2>
          <p className="text-muted font-size-0_9">{bio}</p>
        </div>
      </section>

      <section className="user-posts">
        <h3>Recent Posts</h3>
        {posts.map((post) => (
          <PostSummary key={post.id} post={post} />
        ))}
      </section>
    </Layout>
  );
};
