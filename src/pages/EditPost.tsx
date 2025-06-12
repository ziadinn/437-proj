import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { usePost, useCreatePost, useUpdatePost } from '../hooks/usePosts';

export const EditPost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [titleTouched, setTitleTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  
  // React Query hooks
  const { data: post, isLoading: postLoading, error: postError } = usePost(postId || '');
  const { mutate: createPost, isPending: isCreating, error: createError } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating, error: updateError } = useUpdatePost();

  const isEditMode = Boolean(postId);
  const isLoading = isCreating || isUpdating;

  // Load post data if editing
  useEffect(() => {
    if (isEditMode && post) {
      setTitle(post.title);
      setDescription(post.description || '');
      setContent(post.content);
      setPublished(post.published);
    }
  }, [isEditMode, post]);

  // Handle navigation if post doesn't exist
  useEffect(() => {
    if (isEditMode && postError && !postLoading) {
      navigate('/dashboard');
    }
  }, [isEditMode, postError, postLoading, navigate]);

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

    const postData = {
      title: title.trim(),
      description: description.trim() || undefined,
      content: content.trim(),
      published
    };

    if (isEditMode && postId) {
      updatePost({ postId, postData }, {
        onError: (error) => {
          setSaveError(error.message || 'Failed to update post');
        }
      });
    } else {
      createPost(postData, {
        onError: (error) => {
          setSaveError(error.message || 'Failed to create post');
        }
      });
    }
  };

  const handleSaveDraft = async () => {
    setSaveError(null);
    
    if (!title.trim() || !content.trim()) {
      setSaveError('Title and content are required');
      return;
    }

    const postData = {
      title: title.trim(),
      description: description.trim() || undefined,
      content: content.trim(),
      published: false
    };

    if (isEditMode && postId) {
      updatePost({ postId, postData }, {
        onError: (error) => {
          setSaveError(error.message || 'Failed to save draft');
        }
      });
    } else {
      createPost(postData, {
        onError: (error) => {
          setSaveError(error.message || 'Failed to save draft');
        }
      });
    }
  };

  // Show loading state while fetching post in edit mode
  if (isEditMode && postLoading) {
    return (
      <Layout headerNav={headerNav}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'var(--text-muted-color)' }}>Loading post...</p>
        </div>
      </Layout>
    );
  }

  const currentError = saveError || createError?.message || updateError?.message;

  return (
    <Layout headerNav={headerNav}>
      <h2>{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
      
      {currentError && (
        <div className="alert alert-error" style={{ 
          backgroundColor: '#ff4444', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {currentError}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
              disabled={isLoading}
            />
            Publish
          </label>
          <small className="form-text" style={{ color: '#888' }}>
            Uncheck to save as draft. Drafts are only visible to you.
          </small>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="submit" 
            className="button"
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            {isLoading ? 'Saving...' : (published ? 'Publish' : 'Save Draft')}
          </button>
          
          {published && (
            <button 
              type="button" 
              className="button-secondary"
              onClick={handleSaveDraft}
              disabled={isLoading || !title.trim() || !content.trim()}
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