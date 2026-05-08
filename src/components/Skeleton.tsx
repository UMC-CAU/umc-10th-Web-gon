export default function Skeleton() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-4">
      <div className="h-48 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}