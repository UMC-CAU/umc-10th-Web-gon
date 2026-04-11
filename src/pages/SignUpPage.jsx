import useForm from '../hooks/useForm';
import axios from 'axios';

const SignUpPage = () => {
  const handleSignUp = async (values) => {
    try {
                const response = await axios.post('http://localhost:8000/v1/auth/signup', {
        email: values.email,
        password: values.password,
        name: values.name, 
        });
      console.log(response.data);
      alert('회원가입이 완료되었습니다!');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('회원가입에 실패했습니다.');
    }
  };

  const { values, handleChange, handleSubmit, isLoading } = useForm({
    initialState: { email: '', password: '', name: '' },
    onSubmit: handleSignUp,
  });

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="name" 
        value={values.name} 
        onChange={handleChange} 
        placeholder="이름" 
      />
      <input 
        name="email" 
        value={values.email} 
        onChange={handleChange} 
        placeholder="이메일" 
      />
      <input 
        name="password" 
        type="password" 
        value={values.password} 
        onChange={handleChange} 
        placeholder="비밀번호" 
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? '가입 중...' : '회원가입'}
      </button>
    </form>
  );
};

export default SignUpPage;