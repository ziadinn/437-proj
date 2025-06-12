// Legacy Post interface for existing components
export interface LegacyPost {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  author: string;
  createdAt: Date;
  excerpt: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  postId: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  posts: LegacyPost[];
  email?: string;
  createdAt?: Date;
  profileImageBase64?: string;
  description?: string;
}

export interface BlogStats {
  weeklyViewsIncrease: number;
  unreadComments: number;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

// API Post types for backend integration
export interface Post {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  content: string;
  author: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string;
}

export interface CreatePostRequest {
  title: string;
  description?: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  content?: string;
  published?: boolean;
}

export interface PostResponse {
  success: boolean;
  message: string;
  post?: Post;
}

export interface PostsListResponse {
  success: boolean;
  message: string;
  posts?: Post[];
  total?: number;
} 