import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string(),
  nickname: z.string().min(1, '닉네임을 입력해주세요.')
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: '비밀번호가 일치하지 않습니다.',
});