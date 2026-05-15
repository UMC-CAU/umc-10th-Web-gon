import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import QueryError from '../components/QueryError';
import Skeleton from '../components/Skeleton';
import { useGetMyInfo } from '../hooks/useGetMyInfo';
import { useUpdateMyInfo } from '../hooks/useUpdateMyInfo';

export default function MyPage() {
  const { data, isPending, isError, refetch } = useGetMyInfo();
  const updateMyInfoMutation = useUpdateMyInfo();
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
            : error.response?.data?.message || 'Failed to update profile.';
          alert(message);
        },
      },
    );
  };

  if (isPending) return <Skeleton />;

  if (isError || !me) {
    return <QueryError message="Failed to load my page." onRetry={() => refetch()} />;
  }

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
                {me.bio || 'No bio yet.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Edit profile"
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
              Name
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
              Bio
              <textarea
                rows={4}
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                className="resize-none rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
                placeholder="Optional"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-gray-300">
              Profile image URL
              <input
                value={form.avatar}
                onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
                className="rounded-lg border border-[#333] bg-[#111] px-4 py-3 text-sm text-white outline-none focus:border-pink-500"
                placeholder="Optional"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={updateMyInfoMutation.isPending}
                className="rounded-lg bg-[#333] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMyInfoMutation.isPending}
                className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-[#444]"
              >
                {updateMyInfoMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
