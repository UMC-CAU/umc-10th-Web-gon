import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLP } from '../apis/lp';

export default function WritePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    thumbnail: '',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (tags.length === 0) {
      alert('태그를 1개 이상 입력해주세요.');
      return;
    }

    try {
      await createLP({
        title: formData.title,
        content: formData.content,
        thumbnail: formData.thumbnail.trim() || undefined,
        tags,
        published: true,
      });

      alert('LP가 성공적으로 등록되었습니다.');
      navigate('/lps');
    } catch (error: any) {
      console.error(error);
      const errorMessage = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join('\n')
        : error.response?.data?.message || '등록에 실패했습니다.';
      alert(`등록 실패: ${errorMessage}`);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8">
      <div className="w-full max-w-2xl bg-[#181818] rounded-2xl p-8 border border-[#222]">
        <h1 className="text-2xl font-bold text-pink-500 mb-8 text-center uppercase tracking-tighter">New Release</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400">TITLE</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#222] border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="앨범 제목을 입력하세요"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400">IMAGE URL</label>
            <input
              type="text"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="bg-[#222] border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="이미지 URL(https://...)을 입력하세요"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400">TAGS</label>
            <input
              type="text"
              required
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="bg-[#222] border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              placeholder="rock, jazz, indie 처럼 쉼표로 구분해서 입력하세요"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-400">DESCRIPTION</label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-[#222] border-none rounded-lg p-4 text-white focus:ring-2 focus:ring-pink-500 outline-none resize-none transition-all"
              placeholder="음악과 앨범에 대한 설명을 자유롭게 적어주세요"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#282828] hover:bg-[#333] text-white font-bold py-4 rounded-xl transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-500/20 transition-all"
            >
              PUBLISH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
