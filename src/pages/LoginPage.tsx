import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { accessToken, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const from = (location.state as { from?: string } | null)?.from || '/lps';

  useEffect(() => {
    if (accessToken) {
      navigate(from, { replace: true });
    }
  }, [accessToken, from, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join('\n')
        : error.response?.data?.message || '로그인에 실패했습니다.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-[#2a2a2a] bg-[#181818] p-8">
        <h1 className="mb-8 text-center text-2xl font-black text-pink-500">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
            이메일
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-[#333] bg-[#111] p-3 text-white outline-none focus:border-pink-500"
              placeholder="email@example.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
            비밀번호
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-lg border border-[#333] bg-[#111] p-3 text-white outline-none focus:border-pink-500"
              placeholder="비밀번호"
            />
          </label>

          {errorMessage && <p className="whitespace-pre-line text-sm text-pink-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-pink-500 py-3 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-bold text-black hover:bg-gray-200"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="" className="h-5 w-5" />
          Google 로그인
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          계정이 없나요?{' '}
          <Link to="/signup" className="font-bold text-pink-500 hover:text-pink-400">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
