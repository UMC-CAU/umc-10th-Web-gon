import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLike } from '../apis/api';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { ApiResponse, LP, User } from '../types';

export const usePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLike,
    onMutate: async (lpId) => {
      const queryKey = [QUERY_KEYS.LPS, String(lpId)];

      await queryClient.cancelQueries({ queryKey });

      const previousLPPost = queryClient.getQueryData<ApiResponse<LP>>(queryKey);
      const myInfo = queryClient.getQueryData<ApiResponse<User>>(['myInfo']);
      const usersMe = queryClient.getQueryData<{ data: ApiResponse<User> }>(['users', 'me']);
      const myId = myInfo?.data?.id ?? usersMe?.data?.data?.id;

      if (!previousLPPost || !myId) {
        return { previousLPPost };
      }

      const likedIndex = previousLPPost.data.likes.findIndex((like) => {
        const likedUserId = like.userId ?? like.likeUserId;
        return likedUserId === myId;
      });

      if (likedIndex >= 0) {
        return { previousLPPost };
      }

      const newLPPost: ApiResponse<LP> = {
        ...previousLPPost,
        data: {
          ...previousLPPost.data,
          likes: [
            ...previousLPPost.data.likes,
            {
              userId: myId,
              lpId,
            },
          ],
        },
      };

      queryClient.setQueryData(queryKey, newLPPost);

      return { previousLPPost, newLPPost };
    },
    onError: (_error, lpId, context) => {
      if (context?.previousLPPost) {
        queryClient.setQueryData([QUERY_KEYS.LPS, String(lpId)], context.previousLPPost);
      }
    },
    onSettled: (_data, _error, lpId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LPS, String(lpId)] });
    },
  });
};
