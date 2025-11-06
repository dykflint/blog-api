// src/pages/PostDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function PostDetail() {
  const { id } = useParams(); // post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);

  // Fetch the post and its comments
  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`${API_URL}/posts/${id}`),
          fetch(`${API_URL}/posts/${id}/comments`),
        ]);

        if (!postRes.ok) throw new Error('Failed to load post');
        if (!commentsRes.ok) throw new Error('Failed to load comments');

        const postData = await postRes.json();
        const commentsData = await commentsRes.json();

        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Submit a new comment
  async function handleCommentSubmit(e) {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          guestName: 'Anonymous', // or get from a guest input field
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');
      console.log(commentText);
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setCommentText('');
    } catch (error) {
      console.error(error);
      alert('Error adding comment');
    }
  }

  // --- Render states ---
  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1>{post.title}</h1>
      <p style={{ color: '#555' }}>
        {post.category?.name ? `Category: ${post.category.name}` : 'Uncategorized'} |{' '}
        {post.author?.username ? `By ${post.author.username}` : 'Unknown author'}
      </p>

      <article style={{ marginTop: '1rem', lineHeight: '1.6' }}>{post.content}</article>

      <hr style={{ margin: '2rem 0' }} />

      <section>
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 ? (
          <p>No comments yet. Be the first!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map(c => (
              <li
                key={c.id}
                style={{
                  marginBottom: '1rem',
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '0.5rem',
                }}
              >
                <strong>{c.author?.username || c.authorName || 'Anonymous'}</strong>
                <p style={{ marginTop: '0.25rem' }}>{c.content}</p>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleCommentSubmit} style={{ marginTop: '1re' }}>
          <textarea
            rows="3"
            placeholder="Write a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          <button type="submit" style={{ marginTop: '0.5rem' }}>
            Post Comment
          </button>
        </form>
      </section>
    </div>
  );
}
