import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header'; 
import Sidebar from './Sidebar';

export default function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-6 mt-16 relative">
          <Outlet />
          <button
            onClick={() => navigate('/write')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg transition-colors z-50"
          >
            +
          </button>
        </main>
      </div>
    </div>
  );
}
