export interface Post {
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
  posts: Post[];
}

export interface BlogStats {
  weeklyViewsIncrease: number;
  unreadComments: number;
} 