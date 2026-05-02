import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const postSignIn = async (signInData: any) => {
  return await axios.post(`${BASE_URL}/v1/auth/signIn`, signInData);
};

export const postLogout = async () => {
  const token = localStorage.getItem('accessToken');
  
  return await axios.post(`${BASE_URL}/v1/auth/signout`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};