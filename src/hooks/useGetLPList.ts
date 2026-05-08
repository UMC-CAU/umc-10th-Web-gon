import { useQuery } from '@tanstack/react-query';
import { getLPList } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGetLPList = (sort: 'ascending' | 'descending') => {
  return useQuery({
    queryKey: [QUERY_KEYS.LPS, sort],
    queryFn: () => getLPList({ sort }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    select: (res) => res,
  });
};
