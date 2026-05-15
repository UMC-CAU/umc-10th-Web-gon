import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QueryError from '../components/QueryError';
import Skeleton from '../components/Skeleton';
import { useGetMyInfo } from '../hooks/useGetMyInfo';
import { useGetMyLPList } from '../hooks/useGetMyLPList';
import { useGetMyLikedLPList } from '../hooks/useGetMyLikedLPList';
import { useUpdateMyInfo } from '../hooks/useUpdateMyInfo';
import type { LP } from '../types';

type MyLPSection = 'created' | 'liked';

function MyLPCard({ lp }: { lp: LP }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/lp/${lp.id}`)}
      className="group flex gap-4 rounded-lg border border-[#2a2a2a] bg-[#151515] p-3 text-left transition-colors hover:border-pink-500"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#222]">
        {lp.thumbnail ? (
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="text-xs font-bold text-gray-500">LP</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-white">{lp.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">{lp.content}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{lp.createdAt ? new Date(lp.createdAt).toLocaleDateString('ko-KR') : ''}</span>
          <span>♥ {lp.likes?.length ?? 0}</span>
        </div>
      </div>
    </button>
  );
}

export default function MyPage() {
  const { data, isPending, isError, refetch } = useGetMyInfo();
  const updateMyInfoMutation = useUpdateMyInfo();
  const [activeSection, setActiveSection] = useState<MyLPSection>('created');
  const sort = 'descending';
  const myLPListQuery = useGetMyLPList(sort);
  const myLikedLPListQuery = useGetMyLikedLPList(sort);
  const me = data?.data;
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatar: '',
  });

  useEffect(() => {
    if (!me || isEditing) return;

    setForm({
      name: me.name ?? '',
      bio: me.bio ?? '',
      avatar: me.avatar ?? '',
    });
  }, [me, isEditing]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateMyInfoMutation.mutate(
      {
        name: form.name.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: (error: any) => {
          const message = Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join('\n')
            : error.response?.data?.message || '프로필 수정에 실패했습니다.';
          alert(message);
        },
      },
    );
  };

  if (isPending) return <Skeleton />;

  if (isError || !me) {
    return <QueryError message="마이페이지 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;
  }

  const activeQuery = activeSection === 'created' ? myLPListQuery : myLikedLPListQuery;
  const activeLPList = activeQuery.data?.pages.flatMap((page) => page.data?.data ?? []) ?? [];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8 text-white">
      <section className="rounded-xl border border-[#2a2a2a] bg-[#181818] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {me.avatar ? (
              <img
                src={me.avatar}
                alt={me.name}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-pink-500 text-2xl font-black">
                {me.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold">{me.name}</h1>
              <p className="mt-1 text-sm text-gray-400">{me.email}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                {me.bio || '아직 소개가 없습니다.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="프로필 수정"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-full border border-[#444] p-2 text-gray-300 transition-colors hover:border-white hover:text-white"
          >
            <Settings size={20} />
          </button>
        </div>
      </section>

      {isEditing && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[#2a2a2a] bg-[#181818] p-6">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
              이름
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
              소개
              <textarea
                rows={4}
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                className="resize-none rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
                placeholder="선택 사항"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
              프로필 이미지 URL
              <input
                value={form.avatar}
                onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
                placeholder="선택 사항"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={updateMyInfoMutation.isPending}
                className="rounded-lg bg-[#333] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateMyInfoMutation.isPending}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#444]"
              >
                {updateMyInfoMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      )}

      <section className="rounded-xl border border-[#2a2a2a] bg-[#181818] p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold">내 LP</h2>
          <div className="flex overflow-hidden rounded-lg border border-[#333]">
            <button
              type="button"
              onClick={() => setActiveSection('created')}
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                activeSection === 'created'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              작성한 LP
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('liked')}
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                activeSection === 'liked'
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              좋아요한 LP
            </button>
          </div>
        </div>

        {activeQuery.isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton />
          </div>
        ) : activeQuery.isError ? (
          <QueryError message="LP 목록을 불러오지 못했습니다." onRetry={() => activeQuery.refetch()} />
        ) : activeLPList.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[#333] py-10 text-center text-sm text-gray-500">
            {activeSection === 'created' ? '아직 작성한 LP가 없습니다.' : '아직 좋아요한 LP가 없습니다.'}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeLPList.map((lp) => (
              <MyLPCard key={lp.id} lp={lp} />
            ))}
          </div>
        )}

        {activeQuery.hasNextPage && (
          <button
            type="button"
            onClick={() => activeQuery.fetchNextPage()}
            disabled={activeQuery.isFetchingNextPage}
            className="mt-5 w-full rounded-lg bg-[#333] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {activeQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </button>
        )}
      </section>
    </main>
  );
}
