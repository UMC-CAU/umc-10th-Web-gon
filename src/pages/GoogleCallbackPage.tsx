import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/localStorageKey';

const GoogleCallbackPage = () => {
  const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
  const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      window.location.href = '/my'; 
    }
  }, []);

  return <div>구글 로그인 처리 중입니다... ⏳</div>;
};

export default GoogleCallbackPage;