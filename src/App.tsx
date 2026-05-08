import { useState } from 'react';
import { UserDataDisplay } from './components/UserDataDisplay';

function App() {
  const [userId, setUserId] = useState<number>(1);

  const handleRandomUser = () => {
    const randomId = Math.floor(Math.random() * 15) + 1;
    setUserId(randomId);
  };

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleRandomUser} style={{ marginBottom: '20px' }}>
        다른 사용자 불러오기 (현재 ID: {userId})
      </button>
      
      <UserDataDisplay userId={userId} />
    </div>
  );
}

export default App;