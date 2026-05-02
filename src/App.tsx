import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '20px', borderBottom: '1px solid black', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>홈으로</Link>
        <Link to="/login" style={{ marginRight: '10px' }}>로그인(Public)</Link>
        <Link to="/my">마이페이지(Protected)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/my" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;