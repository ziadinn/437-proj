import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import * as postsApi from '../services/postsApi'
import type { CreatePostRequest, UpdatePostRequest } from '../types'

// Query keys
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: string) => [...postKeys.lists(), { filters }] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
  userPosts: (username: string) => [...postKeys.all, 'user', username] as const,
}

// Get all posts
export const usePosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: postKeys.list(`page-${page}-limit-${limit}`),
    queryFn: () => postsApi.fetchPosts(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get posts by user (public posts only)
export const usePostsByUser = (username: string) => {
  return useQuery({
    queryKey: postKeys.userPosts(username),
    queryFn: () => postsApi.fetchPostsByUser(username),
    enabled: !!username, // Only run if username exists
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get all posts by current authenticated user (including drafts)
export const useMyPosts = () => {
  return useQuery({
    queryKey: [...postKeys.all, 'my'] as const,
    queryFn: () => postsApi.fetchMyPosts(),
    staleTime: 30 * 1000, // 30 seconds (more frequent refresh for user's own posts)
  })
}

// Get single post
export const usePost = (postId: string) => {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => postsApi.fetchPost(postId),
    enabled: !!postId, // Only run if postId exists
    retry: 1, // Only retry once for 404s
  })
}

// Create post mutation
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => postsApi.createPost(postData),
    onSuccess: (newPost) => {
      // Invalidate posts lists to refetch them
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts(newPost.author) })
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'my'] })
      
      // Add the new post to the cache
      queryClient.setQueryData(postKeys.detail(newPost._id!), newPost)
      
      // Navigate to dashboard
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Error creating post:', error)
    }
  })
}

// Update post mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string, postData: UpdatePostRequest }) => 
      postsApi.updatePost({ postId, postData }),
    onSuccess: (updatedPost) => {
      // Update the specific post in cache
      queryClient.setQueryData(postKeys.detail(updatedPost._id!), updatedPost)
      
      // Invalidate lists to refetch them
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts(updatedPost.author) })
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'my'] })
      
      // Navigate to dashboard
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Error updating post:', error)
    }
  })
}

// Delete post mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onSuccess: (_, postId) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) })
      
      // Invalidate lists to refetch them
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, 'my'] })
      
      // Navigate to dashboard
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Error deleting post:', error)
    }
  })
} 