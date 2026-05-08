import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedLayout from './components/ProtectedLayout';
import LPListPage from './pages/LPListPage';
import LPDetailPage from './pages/LPDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WritePage from './pages/WritePage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/lps" replace />} />
            <Route path="/lps" element={<LPListPage />} />
            
            <Route element={<ProtectedLayout />}>
              <Route path="/lp/:lpid" element={<LPDetailPage />} />
              <Route path="/mypage" element={<div className="text-white p-8 text-center text-xl">마이페이지 준비 중</div>} />
              <Route path="/write" element={<WritePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/lps" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
