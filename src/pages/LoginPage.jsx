import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';
import axios from 'axios';

const validateLogin = (values) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.email) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!emailRegex.test(values.email)) {
    errors.email = '유효하지 않은 이메일 형식입니다.';
  }

  if (!values.password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (values.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  return errors;
};

const LoginPage = () => {
  const navigate = useNavigate(); 

  const handleLogin = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/v1/auth/signin', {
        email: values.email,
        password: values.password,
      });

      const token = response.data.data.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
        alert('로그인에 성공했습니다!');
      }
    } catch (error) {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialState: { email: '', password: '' },
    onSubmit: handleLogin,
    validate: validateLogin, 
  });

  const isFormValid = Object.keys(errors).length === 0 && values.email && values.password;

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', marginBottom: '20px' }}
      >
        &lt; 뒤로
      </button>

      <h2>로그인</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <input 
            name="email" 
            value={values.email} 
            onChange={handleChange} 
            placeholder="이메일" 
            style={{ width: '100%', padding: '10px' }}
          />
          {values.email.length > 0 && errors.email && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.email}</p>
          )}
        </div>

        <div>
          <input 
            name="password" 
            type="password" 
            value={values.password} 
            onChange={handleChange} 
            placeholder="비밀번호" 
            style={{ width: '100%', padding: '10px' }}
          />
          {values.password.length > 0 && errors.password && (
            <p style={{ color: 'red', fontSize: '12px', margin: '5px 0 0' }}>{errors.password}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={!isFormValid || isLoading}
          style={{ 
            padding: '12px', 
            backgroundColor: isFormValid ? '#ff4081' : '#ccc', 
            color: 'white', 
            border: 'none', 
            cursor: isFormValid ? 'pointer' : 'not-allowed' 
          }}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

      </form>
    </div>
  );
};

export default LoginPage;