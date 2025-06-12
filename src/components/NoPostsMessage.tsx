import React from 'react';
import { Link } from 'react-router-dom';

interface NoPostsMessageProps {
  message?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const NoPostsMessage: React.FC<NoPostsMessageProps> = ({
  message = "You haven't written any posts yet.",
  buttonText = "Write Your First Post",
  buttonLink = "/edit-post"
}) => {
  return (
    <div style={{ 
      padding: '2rem',
      textAlign: 'center',
      color: 'var(--text-muted-color)',
      backgroundColor: 'var(--card-bg-color)',
      borderRadius: '0.25rem',
      border: '1px solid var(--border-color)'
    }}>
      <p>{message}</p>
      <Link to={buttonLink} className="button" style={{ 
        display: 'block',
        textDecoration: 'none',
        marginTop: '1rem'
      }}>
        {buttonText}
      </Link>
    </div>
  );
}; 