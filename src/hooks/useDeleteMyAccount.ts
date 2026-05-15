import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUsersMe } from '../apis/users';

export const useDeleteMyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUsersMe,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
