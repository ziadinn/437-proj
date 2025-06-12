import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Post, CreatePostRequest, UpdatePostRequest, PostResponse, PostsListResponse } from '../types'
import { API_BASE_URL, getAuthHeaders } from '../config/api'

interface PostsContextType {
  posts: Post[]
  loading: boolean
  error: string | null
  createPost: (postData: CreatePostRequest) => Promise<Post | null>
  updatePost: (postId: string, postData: UpdatePostRequest) => Promise<Post | null>
  deletePost: (postId: string) => Promise<boolean>
  getPost: (postId: string) => Promise<Post | null>
  getPosts: (page?: number, limit?: number) => Promise<void>
  getPostsByUser: (username: string) => Promise<Post[]>
  clearError: () => void
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleApiError = (error: any): string => {
    if (error.message) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
  }

  const createPost = async (postData: CreatePostRequest): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      })

      const data: PostResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.post) {
        // Add to local posts if it's published
        if (data.post.published) {
          setPosts(prev => [data.post!, ...prev])
        }
        return data.post
      } else {
        throw new Error(data.message || 'Failed to create post')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (postId: string, postData: UpdatePostRequest): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(postData)
      })

      const data: PostResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.post) {
        // Update local posts
        setPosts(prev => prev.map(post => 
          post._id === postId ? data.post! : post
        ))
        return data.post
      } else {
        throw new Error(data.message || 'Failed to update post')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      const data: PostResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success) {
        // Remove from local posts
        setPosts(prev => prev.filter(post => post._id !== postId))
        return true
      } else {
        throw new Error(data.message || 'Failed to delete post')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getPost = async (postId: string): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`)
      const data: PostResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.post) {
        return data.post
      } else {
        throw new Error(data.message || 'Post not found')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getPosts = async (page: number = 1, limit: number = 10): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`)
      const data: PostsListResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.posts) {
        setPosts(data.posts)
      } else {
        throw new Error(data.message || 'Failed to fetch posts')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getPostsByUser = async (username: string): Promise<Post[]> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/posts/user/${username}`)
      const data: PostsListResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      if (data.success && data.posts) {
        return data.posts
      } else {
        throw new Error(data.message || 'Failed to fetch user posts')
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const contextValue: PostsContextType = {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    getPostsByUser,
    clearError
  }

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  )
}

export const usePostsContext = (): PostsContextType => {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePostsContext must be used within a PostsProvider')
  }
  return context
}

export default PostsContext 