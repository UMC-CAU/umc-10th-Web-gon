import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLPList } from '../hooks/useGetLPList';
import { LPCardSkeletonGrid } from '../components/Skeleton';
import QueryError from '../components/QueryError';

export default function LPListPage() {
  const [sort, setSort] = useState<'descending' | 'ascending'>('descending');
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLPList(sort);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '240px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) return <QueryError message="LP 목록을 불러오지 못했습니다." onRetry={() => refetch()} />;

  const lpList = data?.pages.flatMap((page) => page.data?.data || []) || [];
  const formatDate = (date: string) => new Date(date).toLocaleDateString('ko-KR');

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex justify-end">
        <div className="flex overflow-hidden rounded border border-gray-600">
          <button
            type="button"
            onClick={() => setSort('ascending')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sort === 'ascending' ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => setSort('descending')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sort === 'descending' ? 'bg-white text-black' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            최신순
          </button>
        </div>
      </div>

      {isLoading ? (
        <LPCardSkeletonGrid count={20} />
      ) : lpList.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#181818] text-center">
          <p className="text-lg font-bold text-white">등록된 LP가 없습니다.</p>
          <p className="mt-2 text-sm text-gray-400">오른쪽 아래 + 버튼으로 새 LP를 추가해보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
          {lpList.map((lp: any) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="group relative aspect-square cursor-pointer overflow-hidden bg-[#222]"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#292929] via-[#1f1f1f] to-[#111] p-4 text-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-pink-400">LP</p>
                  <p className="mt-2 line-clamp-2 text-sm font-bold text-white">{lp.title}</p>
                </div>
              </div>
              {lp.thumbnail && (
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="relative z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className={`absolute inset-0 z-20 flex flex-col justify-end bg-black/70 p-4 text-white transition-opacity duration-300 ${lp.thumbnail ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <h3 className="truncate text-lg font-bold">{lp.title}</h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-300">{formatDate(lp.createdAt)}</span>
                  <span className="text-xs font-medium">♥ {lp.likes?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-8" />

      {isFetchingNextPage && <LPCardSkeletonGrid count={5} />}
      {!hasNextPage && lpList.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-500">마지막 LP입니다.</p>
      )}
    </div>
  );
}
