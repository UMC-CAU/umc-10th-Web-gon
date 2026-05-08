import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserDataDisplay = ({ userId }: { userId: number }) => {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;

  const { data, isPending, isError, error } = useQuery<User, Error>({
    queryKey: ['user', userId], 
    
    queryFn: async ({ signal }) => {
      const response = await fetch(url, { signal });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      return response.json();
    },

    retry: 3, 
    
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,  
  });

  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>응, 에러야 고쳐: {error.message}</div>;
  }

  return (
    <div>
      <h1>TanStack Query 테스트</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <p>유저 이름: {data?.name}</p>
    </div>
  );
};