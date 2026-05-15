import axios from 'axios';
import type { ApiResponse, LP, User } from '../types';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getMyInfo = async () => {
  const response = await axiosInstance.get<ApiResponse<User>>('/v1/users/me');
  return response.data;
};

export const getLPDetail = async (lpId: number) => {
  const response = await axiosInstance.get<ApiResponse<LP>>(`/v1/lps/${lpId}`);
  return response.data;
};

export const postLike = async (lpId: number) => {
  const response = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return response.data;
};

export const deleteLike = async (lpId: number) => {
  const response = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return response.data;
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config; 

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        const res = await axios.post('http://localhost:8000/v1/auth/refresh', {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.data.accessToken; 
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('Refresh Token Expired!', refreshError);
        localStorage.clear();
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
