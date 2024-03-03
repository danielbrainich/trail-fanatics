import { useState, useEffect } from 'react';
import useCsrfToken from './useCsrfToken';
import { useNavigate } from 'react-router-dom';
import config from '../config';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { csrfToken, updateCsrfToken } = useCsrfToken();
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    console.log("token1", csrfToken)
    try {
      // Check if both csrfToken and credentials are available
      if (csrfToken && document.cookie.includes("sessionid")) {
        const response = await fetch(`${config.API_BASE_URL}/accounts/current_user/`, {
          method: 'GET',
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
      } else {
        console.error('CSRF token or credentials not available');
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (csrfToken) {
        await fetchCurrentUser();
      }
    };

    fetchData();
  }, [csrfToken]);


  const login = async (username, password) => {
    setIsLoading(true);
    try {
      if (!csrfToken) {
        await updateCsrfToken();
      }
      const response = await fetch(`${config.API_BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        updateCsrfToken();
        await fetchCurrentUser();
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error', error);

    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (!csrfToken) {
        await updateCsrfToken();
      }
      const response = await fetch(`${config.API_BASE_URL}/accounts/logout/`, {
        method: 'POST',
        headers: {
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
        updateCsrfToken();
        setUser(null);
        navigate('/login');


      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error', error);

    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return { user, isLoading, login, logout, updateUser };
};

export default useAuth;
