// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, logout } from '../utils/auth.js';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate;
  const token = getToken();

  // Fetch all posts from the API when component mounts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        console.log(data);
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        // If token is invalid, logout the user
        logout();
      }
    }

    fetchPosts();
  }, [token]);

  // Delete a post
  async function handleDelete(postId) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete post');

      // Remove deleted post from state
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error(error);
      alert('Error deleting post');
    }
  }

  // Toggle published status
  async function handleTogglePublish(post) {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !post.published }),
      });

      if (!response.ok) throw new Error('Failed to update post');

      const updatedPost = await response.json();

      setPosts(posts.map(p => (p.id === post.id ? updatedPost : p)));
    } catch (error) {
      console.error(error);
      alert('Error updating post');
    }
  }

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      {/* Button to create a new post */}
      <button onClick={() => navigate('/posts/new')}>New Post</button>

      {/* Posts table */}
      <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.author?.username || 'Unknown'}</td>
              <td>{post.category?.name || 'Uncategorized'}</td>
              <td>{post.published ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => navigate(`/posts/${post.id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(post.id)}>Delete</button>
                <button onClick={() => handleTogglePublish(post)}>
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
