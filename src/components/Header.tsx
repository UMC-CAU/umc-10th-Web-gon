import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getUsersMe } from '../apis/users';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { accessToken, logout } = useAuth();
  const isLoggedIn = !!accessToken;
  const { data: me } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getUsersMe,
    enabled: isLoggedIn,
    select: (res) => res.data.data,
  });

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-[#121212] flex items-center justify-between px-4 md:px-8 z-40 border-b border-[#222]">
      <button
        type="button"
        aria-label="사이드바 열기"
        onClick={onMenuClick}
        className="flex h-12 w-12 items-center justify-center text-gray-300 hover:text-white md:hidden"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
        </svg>
      </button>
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <button className="text-gray-300 hover:text-pink-500 transition-colors">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <span className="text-sm font-medium text-white">{me?.name || '회원'}님 반갑습니다.</span>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-white transition-colors">로그아웃</button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-sm text-gray-400 hover:text-pink-500">로그인</Link>
            <Link to="/signup" className="text-sm text-gray-400 hover:text-pink-500">회원가입</Link>
          </div>
        )}
      </div>
    </header>
  );
}
