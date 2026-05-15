import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUsersMe, type UpdateMyInfoRequest } from '../apis/users';
import type { ApiResponse, User } from '../types';

export const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyInfoRequest) => updateUsersMe(payload),
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['myInfo'] }),
        queryClient.cancelQueries({ queryKey: ['users', 'me'] }),
      ]);

      const previousMyInfo = queryClient.getQueryData<ApiResponse<User>>(['myInfo']);
      const previousUsersMe = queryClient.getQueryData<{ data: ApiResponse<User> }>(['users', 'me']);

      if (previousMyInfo) {
        queryClient.setQueryData<ApiResponse<User>>(['myInfo'], {
          ...previousMyInfo,
          data: {
            ...previousMyInfo.data,
            ...payload,
          },
        });
      }

      if (previousUsersMe) {
        queryClient.setQueryData<{ data: ApiResponse<User> }>(['users', 'me'], {
          ...previousUsersMe,
          data: {
            ...previousUsersMe.data,
            data: {
              ...previousUsersMe.data.data,
              ...payload,
            },
          },
        });
      }

      return { previousMyInfo, previousUsersMe };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData(['myInfo'], context.previousMyInfo);
      }

      if (context?.previousUsersMe) {
        queryClient.setQueryData(['users', 'me'], context.previousUsersMe);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
};
