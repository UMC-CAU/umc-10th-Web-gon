import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDeleteMyAccount } from '../hooks/useDeleteMyAccount';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { accessToken, clearAuth } = useAuth();
  const deleteMyAccountMutation = useDeleteMyAccount();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleWithdraw = () => {
    deleteMyAccountMutation.mutate(undefined, {
      onSuccess: () => {
        clearAuth();
        setIsConfirmOpen(false);
        onClose();
        navigate('/login', { replace: true });
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || '회원 탈퇴에 실패했습니다.';
        alert(message);
      },
    });
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-64 flex-col border-r border-[#222] bg-[#181818] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center px-8">
          <Link to="/" onClick={onClose} className="text-2xl font-black tracking-wider text-pink-500">
            DOLIGO
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
          <Link
            onClick={onClose}
            to="/lps"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-[#222] hover:text-white"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium">찾기</span>
          </Link>

          <Link
            onClick={onClose}
            to="/mypage"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-300 transition-colors hover:bg-[#222] hover:text-white"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span className="text-sm font-medium">마이페이지</span>
          </Link>
        </nav>

        {accessToken && (
          <div className="p-8">
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              className="text-xs text-gray-500 transition-colors hover:text-pink-400"
            >
              탈퇴하기
            </button>
          </div>
        )}
      </aside>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4">
          <section className="w-full max-w-sm rounded-xl border border-[#333] bg-[#181818] p-6 text-white shadow-2xl">
            <h2 className="text-lg font-bold">정말 탈퇴하시겠습니까?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              탈퇴하면 계정과 관련 데이터가 삭제됩니다. 계속하시겠습니까?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={deleteMyAccountMutation.isPending}
                className="rounded-lg bg-[#333] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
              >
                아니오
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={deleteMyAccountMutation.isPending}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#444]"
              >
                {deleteMyAccountMutation.isPending ? '탈퇴 중...' : '예'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
