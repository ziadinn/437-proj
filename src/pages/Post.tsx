import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Comment } from '../components/Comment';
import { mockPosts, mockComments } from '../data/mockData';

export const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = mockPosts.find(p => p.id === id);
  const comments = mockComments.filter(c => c.postId === id);

  const headerNav = (
    <Link to="/" className="text-accent text-decoration-none">Home</Link>
  );

  if (!post) {
    return (
      <Layout headerNav={headerNav}>
        <div>Post not found</div>
      </Layout>
    );
  }

  return (
    <Layout headerNav={headerNav}>
      <article className="blog-post">
        <h1>{post.title}</h1>
        {post.subtitle && (
          <p className="post-subtitle text-muted font-size-1 mb-0_5">{post.subtitle}</p>
        )}
        <p className="post-content font-size-0_9 line-height-1_6">
          {post.content}
        </p>
      </article>

      <section className="comments-section">
        <h3>Comments</h3>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </section>
    </Layout>
  );
}; 