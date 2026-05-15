export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LPTag {
  id: number;
  name: string;
}

export interface LPLike {
  id?: number;
  userId?: number;
  likeUserId?: number;
  lpId?: number;
}

export interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail?: string | null;
  authorId?: number;
  createdAt?: string;
  updatedAt?: string;
  author?: User;
  tags?: LPTag[];
  likes: LPLike[];
}

export interface CursorPage<T> {
  data: T[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ImageUploadResult {
  imageUrl: string;
}
