export function LPCardSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="aspect-square animate-pulse bg-[#222]">
          <div className="h-full w-full bg-gradient-to-br from-[#242424] via-[#303030] to-[#1c1c1c]" />
        </div>
      ))}
    </div>
  );
}

export function CommentSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3 rounded-lg border border-[#333] bg-[#1b1b1b] p-4">
          <div className="h-10 w-10 shrink-0 rounded-full bg-[#333]" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="h-3 w-32 rounded bg-[#333]" />
            <div className="h-3 w-full rounded bg-[#2b2b2b]" />
            <div className="h-3 w-2/3 rounded bg-[#2b2b2b]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-4">
      <div className="h-48 bg-[#2a2a2a] rounded w-full"></div>
      <div className="h-4 bg-[#2a2a2a] rounded w-3/4"></div>
      <div className="h-4 bg-[#2a2a2a] rounded w-1/2"></div>
    </div>
  );
}
