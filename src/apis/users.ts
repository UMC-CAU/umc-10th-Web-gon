import { axiosInstance } from './api';
import type { ApiResponse, User } from '../types';

export interface UpdateMyInfoRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

export const getUsersMe = async () => {
  return await axiosInstance.get<ApiResponse<User>>('/v1/users/me');
};

export const updateUsersMe = async (payload: UpdateMyInfoRequest) => {
  const response = await axiosInstance.patch<ApiResponse<User>>('/v1/users', payload);
  return response.data;
};

export const deleteUsersMe = async () => {
  const response = await axiosInstance.delete('/v1/users');
  return response.data;
};
