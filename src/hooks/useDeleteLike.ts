import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLike } from '../apis/api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useDeleteLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS] });
    },
  });
};
