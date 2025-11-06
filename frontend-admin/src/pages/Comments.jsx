// src/pages/Comments.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToken, logout } from '../utils/auth.js';

export default function Comments() {
  // Get the postId from the URL, e.g. /posts/:postId/comments
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = getToken();

  // Fetch all comments from the backend
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch comments');

        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        logout(); // If token expired, log out user
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [token, postId]);

  // Delete a comment
  async function handleDelete(commentId) {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/posts/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete comment');

      // Remove from UI
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  }

  if (loading) return <p>Loading comments...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Comments Management</h1>

      {comments.length === 0 ? (
        <p>No comments found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
          <thead>
            <tr>
              <th>Author</th>
              <th>Post</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(comment => (
              <tr key={comment.id}>
                <td>{comment.author?.username || 'Anonymous'}</td>
                <td>{comment.post?.title || 'Deleted Post'}</td>
                <td>{comment.content}</td>
                <td>{new Date(comment.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(comment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
