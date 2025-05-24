import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface PostSummaryProps {
  post: Post;
}

export const PostSummary: React.FC<PostSummaryProps> = ({ post }) => {
  return (
    <div className="post-summary">
      <Link to={`/post/${post.id}`} className="link-inherit">
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
      </Link>
    </div>
  );
}; 