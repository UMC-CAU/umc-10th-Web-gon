import { useQuery } from '@tanstack/react-query';
import { getLPDetail } from '../apis/api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGetLPDetail = (lpid: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LPS, lpid],
    queryFn: () => getLPDetail(Number(lpid)),
    enabled: !!lpid,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};
