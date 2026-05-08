import { useQuery } from '@tanstack/react-query';
import { getLPDetail } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGetLPDetail = (lpid: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LP_DETAIL, lpid],
    queryFn: () => getLPDetail(lpid),
    enabled: !!lpid,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
