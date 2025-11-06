// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch only published posts
    async function fetchPosts() {
      try {
        const res = await fetch(`${API_URL}/posts`);
        if (!res.ok) throw new Error('Failed to fetch posts');

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Loading state
  if (loading) return <p>Loading posts...</p>;

  // Error state
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // No posts
  if (posts.length === 0) return <p>No posts yet. Check back soon!</p>;
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <h1>My Blog</h1>
      {posts.map(post => (
        <article
          key={post.id}
          style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}
        >
          <h2>{post.title}</h2>
          {post.excerpt && <p>{post.excerpt}</p>}
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            {post.category?.name ? `Category: ${post.category.name}` : 'Uncategorized'}
          </p>
          <Link to={`/posts/${post.id}`} style={{ color: '#077bff', textDecoration: 'none' }}>
            Read more
          </Link>
        </article>
      ))}
    </div>
  );
}
