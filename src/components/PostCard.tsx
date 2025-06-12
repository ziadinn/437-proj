import { Link } from 'react-router-dom'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + '...'
  }

  return (
    <article className="post-summary">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ 
          fontSize: '0.8rem',
          padding: '2px 6px',
          backgroundColor: post.published ? '#28a745' : '#ffc107',
          color: post.published ? 'white' : '#000',
          borderRadius: '3px'
        }}>
          {post.published ? 'Published' : 'Draft'}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted-color)' }}>
          {formatDate(post.updatedAt)}
        </span>
      </div>
      
      <h3 style={{ marginBottom: '0.5rem' }}>
        <Link 
          to={`/posts/${post._id}`}
          className="text-accent text-decoration-none"
        >
          {post.title}
        </Link>
      </h3>
      
      <p style={{ color: 'var(--text-muted-color)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {getExcerpt(post.content)}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="d-flex align-items-center">
          <div style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: 'var(--primary-accent-color)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--button-text-color)',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {post.author.charAt(0).toUpperCase()}
          </div>
          <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'var(--text-color)' }}>
            {post.author}
          </span>
        </div>
        
        <Link 
          to={`/posts/${post._id}`}
          className="text-accent text-decoration-none"
          style={{ fontSize: '0.9rem', fontWeight: '500' }}
        >
          Read more →
        </Link>
      </div>
    </article>
  )
}

export default PostCard 