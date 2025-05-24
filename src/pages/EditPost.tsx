import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const EditPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [allowComments, setAllowComments] = useState('yes');
  const navigate = useNavigate();

  const headerNav = (
    <Link to="/" className="text-accent text-decoration-none">Home</Link>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Post created:', { title, subtitle, content, allowComments });
    // Navigate back to home after publishing
    navigate('/');
  };

  return (
    <Layout headerNav={headerNav}>
      <h2>Create / Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input 
            type="text" 
            id="description" 
            name="description" 
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter post subtitle/description"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="post-body">Post Body</label>
          <textarea 
            id="post-body" 
            name="post-body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here..."
          />
        </div>
        
        <div className="form-group">
          <label>Allow Comments?</label>
          <input 
            type="radio" 
            id="comments-yes" 
            name="allow-comments" 
            value="yes" 
            checked={allowComments === 'yes'}
            onChange={(e) => setAllowComments(e.target.value)}
          />
          <label htmlFor="comments-yes" className="radio-label-mr">Yes</label>
          <input 
            type="radio" 
            id="comments-no" 
            name="allow-comments" 
            value="no"
            checked={allowComments === 'no'}
            onChange={(e) => setAllowComments(e.target.value)}
          />
          <label htmlFor="comments-no" className="radio-label">No</label>
        </div>
        
        <button type="submit" className="button">Publish</button>
      </form>
    </Layout>
  );
}; 