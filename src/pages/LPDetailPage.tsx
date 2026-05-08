import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetLPDetail } from '../hooks/useGetLPDetail';
import Skeleton from '../components/Skeleton';
import { deleteLP, likeLP, unlikeLP, updateLP } from '../apis/lp';
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

  if (isPending) return <Skeleton />;
  if (isError) return <QueryError message="LP 상세 정보를 불러오지 못했습니다." onRetry={() => refetch()} />;

  const createdAt = lp?.createdAt ? new Date(lp.createdAt).toLocaleDateString('ko-KR') : '';
  const isLiked = !!myInfo?.id && lp?.likes?.some((like: { userId: number }) => like.userId === myInfo.id);
  const isMutating = updateMutation.isPending || deleteMutation.isPending || likeMutation.isPending;

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

  return (
    <div className="flex justify-center items-start min-h-screen py-8">
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
    </div>
  );
}
