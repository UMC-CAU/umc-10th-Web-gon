import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postSignUp } from '../apis/auth';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await postSignUp({
        name: form.name,
        email: form.email,
        password: form.password,
        bio: form.bio.trim() || undefined,
        avatar: form.avatar.trim() || undefined,
      });
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join('\n')
        : error.response?.data?.message || '회원가입에 실패했습니다.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-lg border border-[#2a2a2a] bg-[#181818] p-8">
        <h1 className="mb-8 text-center text-2xl font-black text-pink-500">회원가입</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
            닉네임
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-[#333] bg-[#111] p-3 text-white outline-none focus:border-pink-500"
              placeholder="닉네임"
            />
          </label>

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

          <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
            소개
            <input
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="rounded-lg border border-[#333] bg-[#111] p-3 text-white outline-none focus:border-pink-500"
              placeholder="선택 입력"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
            프로필 이미지 URL
            <input
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="rounded-lg border border-[#333] bg-[#111] p-3 text-white outline-none focus:border-pink-500"
              placeholder="선택 입력"
            />
          </label>

          {errorMessage && <p className="whitespace-pre-line text-sm text-pink-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-pink-500 py-3 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          이미 계정이 있나요?{' '}
          <Link to="/login" className="font-bold text-pink-500 hover:text-pink-400">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
