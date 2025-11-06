// src/pages/Categories.jsx
import React, { useState, useEffect } from 'react';
import { getToken, logout } from '../utils/auth.js';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);

  const token = getToken();

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('http://localhost:3000/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch categories');

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        logout(); // logout in case token expired
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, [token]);

  // Create a new category
  async function handleCreateCategory(e) {
    e.preventDefault();
    // The .trim() makes sure spaces are not saved as categories
    if (!newCategory.trim()) return alert('Category name cannot be empty');

    try {
      const res = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) throw new Error('Failed to create category');

      const created = await res.json();
      setCategories([...categories, created]);
      setNewCategory('');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category');
    }
  }

  // Start editing a category
  function startEditing(category) {
    setEditingCategory(category.id);
    setEditedName(category.name);
  }

  // Save edited category
  async function handleSaveEdit(id) {
    if (!editedName.trim()) return alert('Category name cannot be empty');

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editedName }),
      });

      if (!res.ok) throw new Error('Failed to update category');

      const updated = await res.json();
      setCategories(categories.map(cat => (cat.id === id ? updated : cat)));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category');
    }
  }

  // Delete category
  async function handleDeleteCategory(id) {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  }

  if (loading) return <p>Loading categories...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Categories</h1>

      {/* Create category form */}
      <form onSubmit={handleCreateCategory} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="New category name"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Category list */}
      {categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id || index}>
                <td>
                  {editingCategory === cat.id ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td>
                  {editingCategory === cat.id ? (
                    <>
                      <button onClick={() => handleSaveEdit(cat.id)}>Save</button>
                      <button onClick={() => setEditingCategory(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditing(cat)}>Edit</button>
                      <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
