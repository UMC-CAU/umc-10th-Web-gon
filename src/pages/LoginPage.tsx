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
    </div>
  );
};

export default LoginPage;