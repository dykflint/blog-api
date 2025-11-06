// frontend-admin/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PostEditor from './components/PostEditor.jsx';
import Comments from './pages/Comments.jsx';
import Categories from './pages/Categories.jsx';
import { getToken } from './utils/auth.js';

// A small wrapper to protect routes that require authentication
function ProtectedRoute({ children }) {
  const token = getToken();

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes: must be logged in */}
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Posts Management */}
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <PostEditor mode="create" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              {' '}
              <PostEditor mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* Comments Management */}
        <Route
          path="/posts/:postId/comments"
          element={
            <ProtectedRoute>
              <Comments />
            </ProtectedRoute>
          }
        />

        {/* Categories Management */}
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        {/* Redirect all unknown routes to dashboard if logged in, or login otherwise */}
        <Route
          path="*"
          element={
            getToken() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
