import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { usePostsContext } from '../contexts/PostsContext';

export const EditPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [titleTouched, setTitleTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const { createPost, updatePost, getPost, loading, error, clearError } = usePostsContext();

  const isEditMode = Boolean(postId);

  // Load post data if editing
  useEffect(() => {
    if (isEditMode && postId) {
      const loadPost = async () => {
        const post = await getPost(postId);
        if (post) {
          setTitle(post.title);
          setDescription(post.description || '');
          setContent(post.content);
          setPublished(post.published);
        } else {
          navigate('/dashboard');
        }
      };
      loadPost();
    }
  }, [isEditMode, postId, getPost, navigate]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    setSaveError(null);
  }, [clearError]);

  const headerNav = (
    <Link to="/dashboard" className="text-accent text-decoration-none">Dashboard</Link>
  );

  const handleTitleBlur = () => {
    setTitleTouched(true);
  };

  const handleContentBlur = () => {
    setContentTouched(true);
  };

  const isTitleInvalid = titleTouched && !title.trim();
  const isContentInvalid = contentTouched && !content.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTitleTouched(true);
    setContentTouched(true);
    setSaveError(null);
    
    // Validate required fields
    if (!title.trim() || !content.trim()) {
      setSaveError('Title and content are required');
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        title: title.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        published
      };

      let result;
      if (isEditMode && postId) {
        result = await updatePost(postId, postData);
      } else {
        result = await createPost(postData);
      }

      if (result) {
        // Navigate to dashboard after successful save
        navigate('/dashboard');
      } else {
        setSaveError(error || 'Failed to save post');
      }
    } catch {
      setSaveError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaveError(null);
    
    if (!title.trim() || !content.trim()) {
      setSaveError('Title and content are required');
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        title: title.trim(),
        description: description.trim() || undefined,
        content: content.trim(),
        published: false
      };

      let result;
      if (isEditMode && postId) {
        result = await updatePost(postId, { ...postData, published: false });
      } else {
        result = await createPost({ ...postData, published: false });
      }

      if (result) {
        navigate('/dashboard');
      } else {
        setSaveError(error || 'Failed to save draft');
      }
    } catch {
      setSaveError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout headerNav={headerNav}>
      <h2>{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
      
      {(error || saveError) && (
        <div className="alert alert-error" style={{ 
          backgroundColor: '#ff4444', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {saveError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title<span className="text-secondary-accent">*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Enter post title"
            maxLength={200}
            disabled={loading || isLoading}
            style={{
              outline: isTitleInvalid ? '2px solid #ff4444' : undefined,
              borderColor: isTitleInvalid ? '#ff4444' : undefined
            }}
          />
          <small className="form-text" style={{ color: '#888' }}>
            {title.length}/200 characters
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input 
            type="text" 
            id="description" 
            name="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description (optional)"
            maxLength={300}
            disabled={loading || isLoading}
          />
          <small className="form-text" style={{ color: '#888' }}>
            {description.length}/300 characters • Optional excerpt for your post
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="post-body">Post Content<span className="text-secondary-accent">*</span></label>
          <textarea 
            id="post-body" 
            name="post-body"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleContentBlur}
            placeholder="Write your post content here..."
            maxLength={50000}
            disabled={loading || isLoading}
            rows={12}
            style={{
              outline: isContentInvalid ? '2px solid #ff4444' : undefined,
              borderColor: isContentInvalid ? '#ff4444' : undefined,
              minHeight: '300px',
              resize: 'vertical'
            }}
          />
          <small className="form-text" style={{ color: '#888' }}>
            {content.length}/50,000 characters
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="published" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="published" 
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              disabled={loading || isLoading}
            />
            Publish immediately
          </label>
          <small className="form-text" style={{ color: '#888' }}>
            Uncheck to save as draft. Drafts are only visible to you.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="button"
            disabled={loading || isLoading || !title.trim() || !content.trim()}
          >
            {isLoading ? 'Saving...' : (published ? 'Publish' : 'Save Draft')}
          </button>
          
          {published && (
            <button 
              type="button" 
              className="button-secondary"
              onClick={handleSaveDraft}
              disabled={loading || isLoading || !title.trim() || !content.trim()}
            >
              Save as Draft
            </button>
          )}
          
          <Link 
            to="/dashboard" 
            className="button-secondary"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Layout>
  );
}; 