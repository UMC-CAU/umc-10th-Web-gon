import { axiosInstance } from './api';

export interface GetLPListParams {
  sort?: 'ascending' | 'descending';
  cursor?: number;
  limit?: number;
}

export interface GetLPCommentsParams {
  cursor?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export interface CreateLPCommentRequest {
  content: string;
}

export interface CreateLPRequest {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  published: boolean;
}

export type UpdateLPRequest = Partial<CreateLPRequest>;

export const getLPList = async (params: GetLPListParams) => {
  const { sort, ...restParams } = params;
  const response = await axiosInstance.get('/v1/lps', {
    params: {
      ...restParams,
      order: sort === 'ascending' ? 'asc' : 'desc',
    },
  });
  return response.data;
};

export const getLPDetail = async (lpid: string) => {
  const response = await axiosInstance.get(`/v1/lps/${lpid}`);
  return response.data;
};

export const createLP = async (payload: CreateLPRequest) => {
  const response = await axiosInstance.post('/v1/lps', payload);
  return response.data;
};

export const updateLP = async (lpid: string, payload: UpdateLPRequest) => {
  const response = await axiosInstance.patch(`/v1/lps/${lpid}`, payload);
  return response.data;
};

export const deleteLP = async (lpid: string) => {
  const response = await axiosInstance.delete(`/v1/lps/${lpid}`);
  return response.data;
};

export const likeLP = async (lpid: string) => {
  const response = await axiosInstance.post(`/v1/lps/${lpid}/likes`);
  return response.data;
};

export const unlikeLP = async (lpid: string) => {
  const response = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
  return response.data;
};

export const getLPComments = async (lpid: string, params: GetLPCommentsParams) => {
  const response = await axiosInstance.get(`/v1/lps/${lpid}/comments`, { params });
  return response.data;
};

export const createLPComment = async (lpid: string, payload: CreateLPCommentRequest) => {
  const response = await axiosInstance.post(`/v1/lps/${lpid}/comments`, payload);
  return response.data;
};
