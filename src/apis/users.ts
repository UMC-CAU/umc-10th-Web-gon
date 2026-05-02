import { axiosInstance } from './api';

export const getUsersMe = async () => {
  return await axiosInstance.get('/v1/users/me'); 
};