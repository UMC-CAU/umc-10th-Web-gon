import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLP, type CreateLPRequest } from '../apis/lp';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useCreateLP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLPRequest) => createLP(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
    },
  });
};
