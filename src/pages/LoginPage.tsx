import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const { accessToken, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/v1/auth/google/login';
  };

  const handleLogin = async (values: any) => {
    try {
      await login(values);
      window.location.href = '/my';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin({ email: 'test@test.com', password: 'password' });
        }}
      >
        <button type="submit">로그인</button>
      </form>
      <button 
        onClick={handleGoogleLogin} 
        style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="google" style={{ width: '20px', marginRight: '10px' }} />
        Google 로그인
      </button>
    </div>
  );
};

export default LoginPage;