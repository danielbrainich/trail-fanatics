import { useState, useEffect } from 'react';
import useCsrfToken from '../hooks/useCsrfToken';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const csrfToken = useCsrfToken();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/accounts/current_user/', {
          credentials: 'include',
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [csrfToken]);

  return { user, isLoading };
};

export default useAuth;
