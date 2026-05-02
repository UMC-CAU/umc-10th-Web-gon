import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; 

export const getUsersMe = async () => {
  const token = localStorage.getItem('accessToken');

  return await axios.get(`${BASE_URL}/v1/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};