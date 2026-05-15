import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/api';
import { LOCAL_STORAGE_KEY } from '../constants/localStorageKey';

export const useGetMyInfo = () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  return useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    enabled: !!accessToken,
  });
};
