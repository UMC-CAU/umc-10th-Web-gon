import { Heart, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import QueryError from '../components/QueryError';
import Skeleton from '../components/Skeleton';
import { deleteLP, updateLP } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useGetLPDetail } from '../hooks/useGetLPDetail';
import { useGetMyInfo } from '../hooks/useGetMyInfo';
import { usePostLike } from '../hooks/usePostLike';
import { useDeleteLike } from '../hooks/useDeleteLike';

export default function LPDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lpId = lpid ?? '';
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    thumbnail: '',
    tags: '',
  });

  const {
    data: lpDetail,
    isPending,
    isError,
    refetch,
  } = useGetLPDetail(lpId);
  const { data: myInfo } = useGetMyInfo();
  const postLikeMutation = usePostLike();
  const deleteLikeMutation = useDeleteLike();

  const lp = lpDetail?.data;
  const me = myInfo?.data;
  const myUserId = me?.id;
  const isLiked = !!myUserId && !!lp?.likes?.some((like) => {
    const likedUserId = like.userId ?? like.likeUserId;
    return likedUserId === myUserId;
  });
  const isLikePending = postLikeMutation.isPending || deleteLikeMutation.isPending;
  const lpOwnerId = lp?.author?.id ?? lp?.authorId;
  const canManageLP = !!myUserId && (!lpOwnerId || lpOwnerId === myUserId);

  useEffect(() => {
    if (!lp || isEditing) return;

    setEditForm({
      title: lp.title ?? '',
      content: lp.content ?? '',
      thumbnail: lp.thumbnail ?? '',
      tags: lp.tags?.map((tag) => tag.name).join(', ') ?? '',
    });
  }, [lp, isEditing]);

  const updateLPMutation = useMutation({
    mutationFn: () => {
      const tags = editForm.tags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter(Boolean);

      if (tags.length === 0) {
        throw new Error('태그를 1개 이상 입력해주세요.');
      }

      return updateLP(lpId, {
        title: editForm.title,
        content: editForm.content,
        thumbnail: editForm.thumbnail.trim() || undefined,
        tags,
        published: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      const message = error.message || error.response?.data?.message || 'LP 수정에 실패했습니다.';
      alert(message);
    },
  });

  const deleteLPMutation = useMutation({
    mutationFn: () => deleteLP(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
      navigate('/lps');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'LP 삭제에 실패했습니다.';
      alert(message);
    },
  });
  const isMutatingLP = updateLPMutation.isPending || deleteLPMutation.isPending;

  const handleToggleLike = () => {
    if (!lp || !lpId || isLikePending) return;

    if (!myUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const numericLpId = Number(lpId);
    if (Number.isNaN(numericLpId)) return;

    if (isLiked) {
      deleteLikeMutation.mutate(numericLpId);
      return;
    }

    postLikeMutation.mutate(numericLpId);
  };

  const handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!myUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    updateLPMutation.mutate();
  };

  const handleDelete = () => {
    if (!myUserId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!window.confirm('정말 이 LP를 삭제하시겠습니까?')) return;
    deleteLPMutation.mutate();
  };

  if (isPending) return <Skeleton />;

  if (isError || !lp) {
    return (
      <QueryError
        message="LP 상세 정보를 불러오지 못했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <main className="flex min-h-screen justify-center px-4 py-10 text-white">
      <section className="w-full max-w-3xl rounded-2xl bg-[#222222] p-6 shadow-2xl md:p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-pink-400">
              {lp.author?.name ?? '알 수 없는 작성자'}
            </p>
            <h1 className="mt-2 truncate text-2xl font-bold md:text-3xl">
              {lp.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isLikePending}
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#444] px-4 py-2 text-sm font-bold transition-colors hover:border-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Heart
              size={24}
              fill={isLiked ? 'red' : 'transparent'}
              color={isLiked ? 'red' : 'black'}
              className="drop-shadow-[0_0_1px_white]"
            />
            <span>{lp.likes?.length ?? 0}</span>
          </button>
        </div>

        {canManageLP && (
          <div className="mb-8 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              disabled={isMutatingLP}
              aria-label={isEditing ? '수정 취소' : 'LP 수정'}
              className="rounded-full border border-[#444] p-2 text-gray-300 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? <X size={18} /> : <Pencil size={18} />}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isMutatingLP}
              aria-label="LP 삭제"
              className="rounded-full border border-[#444] p-2 text-gray-300 transition-colors hover:border-pink-500 hover:text-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {isEditing && (
          <form onSubmit={handleEditSubmit} className="mb-8 flex flex-col gap-3">
            <input
              required
              value={editForm.title}
              onChange={(event) => setEditForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="LP 제목"
            />
            <input
              value={editForm.thumbnail}
              onChange={(event) => setEditForm((prev) => ({ ...prev, thumbnail: event.target.value }))}
              className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="썸네일 URL"
            />
            <textarea
              required
              rows={4}
              value={editForm.content}
              onChange={(event) => setEditForm((prev) => ({ ...prev, content: event.target.value }))}
              className="resize-none rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="LP 소개"
            />
            <input
              required
              value={editForm.tags}
              onChange={(event) => setEditForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="태그를 쉼표로 구분해서 입력"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isMutatingLP}
                className="rounded-lg bg-[#333] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isMutatingLP}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#444]"
              >
                {updateLPMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        )}

        <div className="mx-auto mb-8 flex aspect-square w-full max-w-sm items-center justify-center overflow-hidden rounded-full border-[12px] border-[#111] bg-[#151515] shadow-[0_0_30px_rgba(0,0,0,0.45)]">
          {lp.thumbnail ? (
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-gray-500">
              LP
            </span>
          )}
        </div>

        <p className="mx-auto max-w-2xl whitespace-pre-wrap text-center text-sm leading-7 text-gray-300">
          {lp.content}
        </p>

        {!!lp.tags?.length && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-[#333] px-3 py-1 text-sm text-gray-300"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
