import { axiosInstance } from './api';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
}

export const postSignIn = async (signInData: SignInRequest) => {
  return await axiosInstance.post('/v1/auth/signin', signInData);
};

export const postSignUp = async (signUpData: SignUpRequest) => {
  return await axiosInstance.post('/v1/auth/signup', signUpData);
};

export const postLogout = async () => {
  return await axiosInstance.post('/v1/auth/signout');
};
