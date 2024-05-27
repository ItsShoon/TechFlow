import { useState, useEffect } from 'react';

const useFetchUser = (email) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(`Fetching user with email: ${email}`); // Log para verificar o email

        const response = await fetch(`http://localhost:5000/api/users?email=${email}`);
        
        console.log('Response status:', response.status); // Log para verificar o status da resposta
        console.log('Response headers:', response.headers); // Log para verificar os headers da resposta

        if (!response.ok) {
          const errorMessage = await response.text();
          console.log('Error message:', errorMessage); // Log para verificar a mensagem de erro
          throw new Error(`Erro ao buscar usuário: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Fetched user data:', data); // Log para verificar os dados recebidos

        setUser(data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error); // Log para verificar o erro
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUser();
    }
  }, [email]);

  return { user, loading, error };
};

export default useFetchUser;