import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLike } from '../apis/api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
    },
  });
};
