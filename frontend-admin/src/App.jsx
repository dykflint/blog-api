// frontend-admin/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/new"
          element={<ProtectedRoute>{/* <PostEditor mode="create" />*/}</ProtectedRoute>}
        />

        <Route
          path="/posts/:id/edit"
          element={<ProtectedRoute>{/* <PostEditor mode="edit" />*/}</ProtectedRoute>}
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
