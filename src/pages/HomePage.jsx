import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Main page</h1>
      <p>홈</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
        <button 
          onClick={() => navigate('/signup')}
          style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#ff4081', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          회원가입
        </button>
        
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#3f51b5', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default HomePage;