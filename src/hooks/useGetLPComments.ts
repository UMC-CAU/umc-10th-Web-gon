import { useInfiniteQuery } from '@tanstack/react-query';
import { getLPComments } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGetLPComments = (lpid: string, order: 'asc' | 'desc') => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.LP_COMMENTS, lpid, order],
    queryFn: ({ pageParam }) => getLPComments(lpid, { cursor: pageParam, limit: 10, order }),
    initialPageParam: 0,
    enabled: !!lpid,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.hasNext) return undefined;
      return lastPage.data.nextCursor;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
