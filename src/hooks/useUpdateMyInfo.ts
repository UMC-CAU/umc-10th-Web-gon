import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUsersMe, type UpdateMyInfoRequest } from '../apis/users';

export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyInfoRequest) => updateUsersMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
