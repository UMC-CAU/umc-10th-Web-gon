import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from './Header'; 
import Sidebar from './Sidebar';
import AddLPModal from './AddLPModal';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddLPModalOpen, setIsAddLPModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 mt-16 relative">
          <Outlet />
          <button
            type="button"
            aria-label="LP 작성 모달 열기"
            onClick={() => setIsAddLPModalOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-colors z-50"
          >
            <Plus size={30} />
          </button>
          <AddLPModal isOpen={isAddLPModalOpen} onClose={() => setIsAddLPModalOpen(false)} />
        </main>
      </div>
    </div>
  );
}
