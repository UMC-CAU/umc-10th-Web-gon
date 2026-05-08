import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedLayout = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (accessToken) {
    return <Outlet />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-lg bg-[#202020] p-6 text-center text-white shadow-2xl">
        <h2 className="mb-3 text-xl font-bold">로그인이 필요합니다.</h2>
        <p className="mb-6 text-sm text-gray-300">확인을 누르면 로그인 페이지로 이동합니다.</p>
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true, state: { from: location.pathname } })}
          className="w-full rounded-lg bg-pink-500 py-3 text-sm font-bold text-white hover:bg-pink-600"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default ProtectedLayout;
