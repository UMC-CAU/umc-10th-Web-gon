import { useInfiniteQuery } from '@tanstack/react-query';
import { getMyLPList } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGetMyLPList = (sort: 'ascending' | 'descending') => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.LPS, 'my', sort],
    queryFn: ({ pageParam }) => getMyLPList({ sort, cursor: pageParam, limit: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.hasNext) return undefined;
      return lastPage.data.nextCursor;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
