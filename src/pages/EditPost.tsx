import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { usePostContext } from '../contexts/PostContext';
import { mockUser } from '../data/mockData';

export const EditPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);
  const navigate = useNavigate();
  const { addPost } = usePostContext();

  const headerNav = (
    <Link to="/" className="text-accent text-decoration-none">Home</Link>
  );

  const handleTitleBlur = () => {
    setTitleTouched(true);
  };

  const handleContentBlur = () => {
    setContentTouched(true);
  };

  const isTitleInvalid = titleTouched && !title.trim();
  const isContentInvalid = contentTouched && !content.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTitleTouched(true);
    setContentTouched(true);
    
    // Validate required fields
    if (!title.trim() || !content.trim()) {
      return;
    }

    // Create the post
    addPost({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      content: content.trim(),
      excerpt: content.trim().substring(0, 100) + (content.length > 100 ? '...' : ''),
      author: mockUser.username,
    });

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
            onBlur={handleTitleBlur}
            placeholder="Enter post title"
            style={{
              outline: isTitleInvalid ? '2px solid #ff4444' : undefined,
              borderColor: isTitleInvalid ? '#ff4444' : undefined
            }}
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
            placeholder="Enter post description"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="post-body">Post Body</label>
          <textarea 
            id="post-body" 
            name="post-body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleContentBlur}
            placeholder="Write your post content here..."
            style={{
              outline: isContentInvalid ? '2px solid #ff4444' : undefined,
              borderColor: isContentInvalid ? '#ff4444' : undefined
            }}
          />
        </div>
        
        {/* Not needed for now */}
        {/* <div className="form-group">
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
        </div> */}
        
        <button type="submit" className="button">Publish</button>
      </form>
    </Layout>
  );
}; 