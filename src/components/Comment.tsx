import React from 'react';
import type { Comment as CommentType } from '../types';

interface CommentProps {
  comment: CommentType;
}

export const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="comment">
      <p className="comment-author">{comment.author}</p>
      <p className="comment-body">{comment.content}</p>
    </div>
  );
}; 