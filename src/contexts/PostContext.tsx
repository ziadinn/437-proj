import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Post, Comment } from '../types';

interface PostContextType {
  posts: Post[];
  comments: Comment[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPost: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addPost = (postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: generateId(),
      createdAt: new Date(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, ...updates } : post
      )
    );
  };

  const deletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    setComments(prevComments => prevComments.filter(comment => comment.postId !== id));
  };

  const getPost = (id: string) => {
    return posts.find(post => post.id === id);
  };

  const getCommentsByPostId = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: new Date(),
    };
    setComments(prevComments => [...prevComments, newComment]);
  };

  const contextValue: PostContextType = {
    posts,
    comments,
    addPost,
    updatePost,
    deletePost,
    getPost,
    getCommentsByPostId,
    addComment,
  };

  return (
    <PostContext.Provider value={contextValue}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}; 