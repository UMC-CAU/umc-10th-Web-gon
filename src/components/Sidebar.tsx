import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="사이드바 닫기"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex w-64 flex-col border-r border-[#222] bg-[#181818] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center px-8">
          <Link to="/" onClick={onClose} className="text-2xl font-black text-pink-500 tracking-wider">
            DOLIGO
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          <Link onClick={onClose} to="/lps" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="font-medium text-sm">찾기</span>
          </Link>
          
          <Link onClick={onClose} to="/mypage" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-[#222] rounded-lg transition-colors">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="font-medium text-sm">마이페이지</span>
          </Link>
        </nav>

        <div className="p-8">
          <button className="text-xs text-gray-500 hover:text-gray-300">탈퇴하기</button>
        </div>
      </aside>
    </>
  );
}
