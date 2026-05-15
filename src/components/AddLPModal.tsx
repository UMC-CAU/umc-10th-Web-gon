import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useCreateLP } from '../hooks/useCreateLP';

interface AddLPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLPModal({ isOpen, onClose }: AddLPModalProps) {
  const createLPMutation = useCreateLP();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => {
    setTitle('');
    setContent('');
    setThumbnail('');
    setTagInput('');
    setTags([]);
  };

  const isSubmitting = createLPMutation.isPending;

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim().replace(/^#/, '');
    if (!nextTag || tags.includes(nextTag)) {
      setTagInput('');
      return;
    }

    setTags((prevTags) => [...prevTags, nextTag]);
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((prevTag) => prevTag !== tag));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (tags.length === 0) {
      alert('태그를 1개 이상 추가해주세요.');
      return;
    }

    createLPMutation.mutate(
      {
        title,
        content,
        thumbnail: thumbnail.trim() || undefined,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
        onError: (error: any) => {
          const message = Array.isArray(error.response?.data?.message)
            ? error.response.data.message.join('\n')
            : error.response?.data?.message || 'LP 생성에 실패했습니다.';
          alert(message);
        },
      },
    );
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      onMouseDown={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-lp-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#333] bg-[#181818] p-6 text-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="add-lp-title" className="text-xl font-bold">
            Add LP
          </h2>
          <button
            type="button"
            aria-label="모달 닫기"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-[#242424] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="LP 제목"
          />

          <input
            value={thumbnail}
            onChange={(event) => setThumbnail(event.target.value)}
            className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="LP 이미지 URL"
          />

          {thumbnail && (
            <div className="flex justify-center rounded-lg border border-[#333] bg-[#111] p-4">
              <img
                src={thumbnail}
                alt="LP preview"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
                className="h-32 w-32 rounded-full object-cover"
              />
            </div>
          )}

          <textarea
            required
            rows={4}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="resize-none rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
            placeholder="LP 소개"
          />

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleAddTag();
                }
              }}
              className="min-w-0 flex-1 rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              placeholder="태그 입력"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-lg bg-[#333] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#444]"
            >
              추가
            </button>
          </div>

          <div className="flex min-h-9 flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 rounded-full bg-[#2b2b2b] px-3 py-1 text-sm text-gray-200"
              >
                #{tag}
                <button
                  type="button"
                  aria-label={`${tag} 태그 삭제`}
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-white"
                >
                  x
                </button>
              </span>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-pink-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#444]"
          >
            {isSubmitting ? 'Adding...' : 'Add LP'}
          </button>
        </form>
      </section>
    </div>
  );
}
