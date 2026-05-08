interface QueryErrorProps {
  message?: string;
  onRetry: () => void;
}

export default function QueryError({ message = '데이터를 불러오지 못했습니다.', onRetry }: QueryErrorProps) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center text-white">
      <p className="text-base font-semibold">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-pink-500 px-5 py-2 text-sm font-bold text-white hover:bg-pink-600"
      >
        다시 시도
      </button>
    </div>
  );
}
