import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLPList } from '../hooks/useGetLPList';
import Skeleton from '../components/Skeleton';
import QueryError from '../components/QueryError';

export default function LPListPage() {
  const [sort, setSort] = useState<'descending' | 'ascending'>('descending');
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useGetLPList(sort);

  if (isPending) return <Skeleton />;
  if (isError) return <QueryError message="LP 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;

  const lpList = data?.data?.data || [];
  const formatDate = (date: string) => new Date(date).toLocaleDateString('ko-KR');

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-6">
        <div className="flex border border-gray-600 rounded overflow-hidden">
          <button 
            onClick={() => setSort('ascending')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sort === 'ascending' ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            오래된순
          </button>
          <button 
            onClick={() => setSort('descending')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sort === 'descending' ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
        {lpList.map((lp: any) => (
          <div 
            key={lp.id} 
            onClick={() => navigate(`/lp/${lp.id}`)}
            className="group relative cursor-pointer aspect-square bg-[#222] overflow-hidden"
          >
            <img 
              src={lp.thumbnail} 
              alt={lp.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <h3 className="text-lg font-bold truncate">{lp.title}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-300">{formatDate(lp.createdAt)}</span>
                <span className="text-xs font-medium">♥ {lp.likes?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
