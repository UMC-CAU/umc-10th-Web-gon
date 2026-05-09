import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetLPDetail } from '../hooks/useGetLPDetail';
import Skeleton, { CommentSkeletonList } from '../components/Skeleton';
import { useGetLPComments } from '../hooks/useGetLPComments';
import { createLPComment, deleteLP, likeLP, unlikeLP, updateLP } from '../apis/lp';
import { getUsersMe } from '../apis/users';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuth } from '../contexts/AuthContext';
import QueryError from '../components/QueryError';

export default function LPDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();
  const { data, isPending, isError, refetch } = useGetLPDetail(lpid as string);
  const lp = data?.data;
  const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
  const [commentText, setCommentText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    thumbnail: '',
    tags: '',
  });

  const { data: myInfo } = useQuery({
    queryKey: ['users', 'me'],
    queryFn: getUsersMe,
    enabled: !!accessToken,
    select: (res) => res.data.data,
  });

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
  } = useGetLPComments(lpid as string, commentOrder);

  useEffect(() => {
    if (!lp || isEditing) return;

    setEditForm({
      title: lp.title || '',
      content: lp.content || '',
      thumbnail: lp.thumbnail || '',
      tags: (lp.tags || []).map((tag: { name: string }) => tag.name).join(', '),
    });
  }, [lp, isEditing]);

  const showError = (error: any, fallbackMessage: string) => {
    const message = Array.isArray(error.response?.data?.message)
      ? error.response.data.message.join('\n')
      : error.response?.data?.message || fallbackMessage;
    alert(message);
  };

  const updateMutation = useMutation({
    mutationFn: () => {
      const tags = editForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length === 0) {
        throw new Error('태그를 1개 이상 입력해주세요.');
      }

      return updateLP(lpid as string, {
        title: editForm.title,
        content: editForm.content,
        thumbnail: editForm.thumbnail.trim() || undefined,
        tags,
        published: true,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LP_DETAIL, lpid] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
      setIsEditing(false);
      alert('LP가 수정되었습니다.');
    },
    onError: (error: any) => {
      showError(error, error.message || '수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLP(lpid as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
      alert('LP가 삭제되었습니다.');
      navigate('/lps');
    },
    onError: (error: any) => {
      showError(error, '삭제에 실패했습니다.');
    },
  });

  const likeMutation = useMutation({
    mutationFn: (liked: boolean) => (liked ? unlikeLP(lpid as string) : likeLP(lpid as string)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LP_DETAIL, lpid] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
    },
    onError: (error: any) => {
      showError(error, '좋아요 처리에 실패했습니다.');
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: () => createLPComment(lpid as string, { content: commentText.trim() }),
    onSuccess: async () => {
      setCommentText('');
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.LP_COMMENTS, lpid, commentOrder],
      });
    },
    onError: (error: any) => {
      showError(error, '댓글 등록에 실패했습니다.');
    },
  });

  useEffect(() => {
    const target = commentLoadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextCommentsPage && !isFetchingNextCommentsPage) {
          fetchNextCommentsPage();
        }
      },
      { rootMargin: '160px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextCommentsPage, hasNextCommentsPage, isFetchingNextCommentsPage, commentOrder]);

  if (isPending) return <Skeleton />;
  if (isError) return <QueryError message="LP 상세 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;

  const createdAt = lp?.createdAt ? new Date(lp.createdAt).toLocaleDateString('ko-KR') : '';
  const isLiked = !!myInfo?.id && lp?.likes?.some((like: { userId: number }) => like.userId === myInfo.id);
  const isMutating = updateMutation.isPending || deleteMutation.isPending || likeMutation.isPending;
  const comments = commentsData?.pages.flatMap((page) => page.data?.data || []) || [];
  const isCommentInvalid = commentText.trim().length === 0;
  const isCommentSubmitting = createCommentMutation.isPending;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    updateMutation.mutate();
  };

  const handleDelete = () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    deleteMutation.mutate();
  };

  const handleLike = () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    likeMutation.mutate(isLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login', { state: { from: `/lp/${lpid}` } });
      return;
    }

    if (isCommentInvalid || isCommentSubmitting) return;
    createCommentMutation.mutate();
  };

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 py-8">
      <div className="w-full max-w-3xl bg-[#222222] rounded-2xl p-8 shadow-2xl">
        
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-200"></div>
            <span className="font-medium text-white">{lp?.author?.name || '알 수 없음'}</span>
          </div>
          <span className="text-sm text-gray-400">{createdAt}</span>
        </div>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-bold text-white">{lp?.title || '제목 없음'}</h1>
          <div className="flex gap-4 text-gray-400">
            <button
              type="button"
              disabled={isMutating}
              onClick={() => setIsEditing((prev) => !prev)}
              className="hover:text-white disabled:opacity-50"
            >
              ✏️
            </button>
            <button
              type="button"
              disabled={isMutating}
              onClick={handleDelete}
              className="hover:text-pink-500 disabled:opacity-50"
            >
              🗑️
            </button>
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleEditSubmit} className="mb-12 flex flex-col gap-4">
            <input
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="bg-[#111] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-pink-500"
              placeholder="제목"
            />
            <input
              value={editForm.thumbnail}
              onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
              className="bg-[#111] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-pink-500"
              placeholder="썸네일 URL"
            />
            <input
              required
              value={editForm.tags}
              onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
              className="bg-[#111] border border-[#333] rounded-lg p-3 text-white outline-none focus:border-pink-500"
              placeholder="태그를 쉼표로 구분해서 입력하세요"
            />
            <textarea
              required
              rows={4}
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              className="bg-[#111] border border-[#333] rounded-lg p-3 text-white outline-none resize-none focus:border-pink-500"
              placeholder="내용"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isMutating}
                onClick={() => setIsEditing(false)}
                className="rounded-lg bg-[#333] px-4 py-2 text-sm font-bold text-white hover:bg-[#3d3d3d] disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isMutating}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600 disabled:opacity-50"
              >
                저장
              </button>
            </div>
          </form>
        )}

        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[12px] border-[#111] shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
            <img 
              src={lp?.thumbnail || 'https://via.placeholder.com/400'} 
              alt="CD Cover" 
              className="absolute inset-0 w-full h-full object-cover" 
            />

            <div className="absolute w-12 h-12 bg-[#222222] rounded-full z-10"></div>
          </div>
        </div>

        <p className="text-gray-300 text-center mb-12 leading-relaxed max-w-xl mx-auto text-sm">
          {lp?.content || '내용이 없습니다.'}
        </p>


        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(lp?.tags || []).map((tag: { id: number; name: string }) => (
            <span key={tag.id} className="bg-[#333] text-gray-300 px-3 py-1 rounded-full text-sm">
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex justify-center border-t border-[#333] pt-6">
          <button
            type="button"
            disabled={isMutating}
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors disabled:opacity-50 ${
              isLiked ? 'text-pink-500 hover:text-pink-400' : 'text-gray-300 hover:text-pink-500'
            }`}
          >
            <span className="text-2xl">♥</span>
            <span className="text-xl font-bold">{lp?.likes?.length || 0}</span>
          </button>
        </div>
        
      </div>

      <section className="w-full max-w-3xl rounded-2xl bg-[#222222] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">댓글</h2>
          <div className="flex overflow-hidden rounded border border-gray-600">
            <button
              type="button"
              onClick={() => setCommentOrder('asc')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${commentOrder === 'asc' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
            >
              오래된순
            </button>
            <button
              type="button"
              onClick={() => setCommentOrder('desc')}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${commentOrder === 'desc' ? 'bg-white text-black' : 'text-gray-300 hover:text-white'}`}
            >
              최신순
            </button>
          </div>
        </div>

        <form onSubmit={handleCommentSubmit} className="mb-6 flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="댓글을 입력하세요"
            />
            <button
              type="submit"
              disabled={isCommentInvalid || isCommentSubmitting}
              className="rounded-lg bg-pink-500 px-5 py-3 text-sm font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#3a3a3a] disabled:text-gray-500"
            >
              {isCommentSubmitting ? '작성 중...' : '작성'}
            </button>
          </div>
          <p className={`text-xs ${isCommentInvalid ? 'text-gray-500' : 'text-gray-400'}`}>
            댓글은 백엔드에 등록되고, 성공하면 목록을 다시 불러옵니다.
          </p>
        </form>

        {isCommentsError && (
          <QueryError message="댓글을 불러오지 못했습니다." onRetry={() => refetchComments()} />
        )}

        {isCommentsLoading && <CommentSkeletonList count={5} />}

        {!isCommentsLoading && !isCommentsError && (
          <div className="flex flex-col gap-4">
            {comments.map((comment: any) => (
              <article key={comment.id} className="rounded-lg border border-[#333] bg-[#1b1b1b] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-teal-200" />
                    <span className="truncate text-sm font-bold text-white">
                      {comment.author?.name || '알 수 없음'}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('ko-KR') : ''}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-gray-300">{comment.content}</p>
              </article>
            ))}

            {comments.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">아직 댓글이 없습니다.</p>
            )}
          </div>
        )}

        <div ref={commentLoadMoreRef} className="h-6" />

        {isFetchingNextCommentsPage && <CommentSkeletonList count={3} />}
        {!hasNextCommentsPage && comments.length > 0 && (
          <p className="py-6 text-center text-sm text-gray-500">마지막 댓글입니다.</p>
        )}
      </section>
    </div>
  );
}
