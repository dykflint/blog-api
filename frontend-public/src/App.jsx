// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';
import CategoryPosts from './pages/CategoryPosts.jsx';
import Header from './components/Header.jsx';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/category:id" element={<CategoryPosts />} />
          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
