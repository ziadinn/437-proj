import type { Post, CreatePostRequest, UpdatePostRequest, PostResponse, PostsListResponse } from '../types'

const API_BASE_URL = 'http://localhost:3000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// Get all published posts
export const fetchPosts = async (page: number = 1, limit: number = 10): Promise<{ posts: Post[], total: number }> => {
  const response = await fetch(`${API_BASE_URL}/posts?page=${page}&limit=${limit}`)
  const data: PostsListResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch posts')
  }
  
  return {
    posts: data.posts || [],
    total: data.total || 0
  }
}

// Get posts by user (public posts only)
export const fetchPostsByUser = async (username: string): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/user/${username}`)
  const data: PostsListResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch user posts')
  }
  
  return data.posts || []
}

// Get all posts by current authenticated user (including drafts)
export const fetchMyPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/my/all`, {
    headers: getAuthHeaders()
  })
  const data: PostsListResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch your posts')
  }
  
  return data.posts || []
}

// Get single post by ID
export const fetchPost = async (postId: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    headers: getAuthHeaders()
  })
  const data: PostResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success || !data.post) {
    throw new Error(data.message || 'Post not found')
  }
  
  return data.post
}

// Create new post
export const createPost = async (postData: CreatePostRequest): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData)
  })
  
  const data: PostResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success || !data.post) {
    throw new Error(data.message || 'Failed to create post')
  }
  
  return data.post
}

// Update post
export const updatePost = async ({ postId, postData }: { postId: string, postData: UpdatePostRequest }): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(postData)
  })
  
  const data: PostResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success || !data.post) {
    throw new Error(data.message || 'Failed to update post')
  }
  
  return data.post
}

// Delete post
export const deletePost = async (postId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  
  const data: PostResponse = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`)
  }
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to delete post')
  }
} 