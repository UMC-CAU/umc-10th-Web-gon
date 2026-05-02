import { axiosInstance } from './api';

export const postSignIn = async (signInData: any) => {
  return await axiosInstance.post('/v1/auth/signin', signInData);
};

export const postLogout = async () => {
  return await axiosInstance.post('/v1/auth/signout');
};