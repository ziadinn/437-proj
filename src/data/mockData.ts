import type { Post, Comment, User, BlogStats } from '../types';
import profileImg from '../assets/cropped-pfp.png';

export const mockUser: User = {
  id: '1',
  username: 'some-user',
  displayName: 'some-user',
  bio: 'Hi, my name is some-user and this is my blog about stuff',
  profileImage: profileImg,
  posts: []
};

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Dire wolves de-extinction efforts',
    excerpt: 'Biotech company announces de-extinction effort',
    content: 'Recent advances in genetic engineering have brought us closer to bringing back dire wolves...',
    author: 'some-user',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'OpenAI announces new model',
    excerpt: 'OpenAI reveals new model earlier this morning',
    content: 'OpenAI has released their latest language model with improved capabilities...',
    author: 'some-user',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Lead is still bad for your brain',
    subtitle: 'But you should know this by now',
    excerpt: 'Research on lead reinforces its dangers',
    content: 'Recent research shows that lead isn\'t good for you and you should avoid it...',
    author: 'some-user',
    createdAt: new Date('2024-01-05'),
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'lovelead',
    content: 'uh oh, im gonna have to visit my doctor',
    postId: '3',
    createdAt: new Date('2024-01-06'),
  },
];

export const mockBlogStats: BlogStats = {
  weeklyViewsIncrease: 17,
  unreadComments: 0,
}; 