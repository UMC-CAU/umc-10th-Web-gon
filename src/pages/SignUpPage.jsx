import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '../schema';
import axios from 'axios';

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange'
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');

  const isStep2Valid = !errors.password && !errors.passwordConfirm && passwordValue && (passwordValue === passwordConfirmValue);

  const handleNextStep1 = async () => {
    const isEmailValid = await trigger('email');
    if (isEmailValid) setStep(2);
  };

  const handleNextStep2 = async () => {
    if (isStep2Valid) setStep(3);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:8000/v1/auth/signup', {
        email: data.email,
        password: data.password,
        name: data.nickname
      });
      alert('회원가입 완료!');
      navigate('/');
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {step === 1 && (
          <>
            <h2>이메일 입력</h2>
            <div>
              <input
                {...register('email')}
                placeholder="이메일"
                style={{ width: '100%', padding: '10px' }}
              />
              {errors.email && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.email.message}</p>}
            </div>
            <button
              type="button"
              onClick={handleNextStep1}
              disabled={!!errors.email || !emailValue}
              style={{ padding: '12px', backgroundColor: (!errors.email && emailValue) ? '#ff4081' : '#ccc', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              다음
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ color: '#666', fontSize: '14px' }}>가입 이메일: {emailValue}</p>
            <h2>비밀번호 설정</h2>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="비밀번호"
                style={{ width: '100%', padding: '10px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
              {errors.password && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.password.message}</p>}
            </div>
            
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('passwordConfirm')}
                placeholder="비밀번호 재확인"
                style={{ width: '100%', padding: '10px' }}
              />
              {errors.passwordConfirm && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.passwordConfirm.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleNextStep2}
              disabled={!isStep2Valid}
              style={{ padding: '12px', backgroundColor: isStep2Valid ? '#ff4081' : '#ccc', color: 'white', border: 'none', cursor: isStep2Valid ? 'pointer' : 'not-allowed' }}
            >
              다음
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2>닉네임 설정</h2>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#999' }}>프로필</span>
            </div>
            <div>
              <input
                {...register('nickname')}
                placeholder="닉네임"
                style={{ width: '100%', padding: '10px' }}
              />
              {errors.nickname && <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.nickname.message}</p>}
            </div>
            <button
              type="submit"
              disabled={!isValid}
              style={{ padding: '12px', backgroundColor: isValid ? '#ff4081' : '#ccc', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              회원가입 완료
            </button>
          </>
        )}

      </form>
    </div>
  );
};

export default SignUpPage;