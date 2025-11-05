// src/components/PostEditor.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../utils/auth.js';

export default function PostEditor() {
  const { id } = useParams(); // for edit mode
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories for dropdown
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('http://localhost:3000/api/categories', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  // If editing, fetch post data
  useEffect(() => {
    if (!id) return; // only for edit mode
    async function fetchPost() {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setExcerpt(data.excerpt || '');
      setPublished(data.published);
      setCategoryId(data.categoryId || '');
    }
    fetchPost();
  }, [id]);

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { title, content, excerpt, published, categoryId };

    const url = id ? `http://localhost:3000/api/posts/${id}` : 'http://localhost:3000/api/posts';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save post');

      // Navigate back to dashboard after success
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };
  return (
    <div>
      <h2>{id ? 'Edit Post' : 'New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:{' '}
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </label>{' '}
        <label>
          Excerpt:
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} />
        </label>
        <label>
          Content:
          <textarea value={content} onChange={e => setContent(e.target.value)} required />
        </label>
        <label>
          Category:
          <select
            value={categoryId}
            onChange={e => {
              setCategoryId(e.target.value);
            }}
          >
            <option value="">Uncategorized</option>
            {categories.map(cat => {
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>;
            })}
          </select>
        </label>
        <label>
          Published:
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
        </label>
        <button type="submit">{id ? 'Update Post' : 'Create Post'}</button>
      </form>
    </div>
  );
}
