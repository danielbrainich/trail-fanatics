import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';


const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getCsrfToken = () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
    return csrfToken ? csrfToken.split('=')[1] : null;
  };

  const fetchCurrentUser = async () => {
    setIsLoading(true);
    const csrfToken = getCsrfToken();
    try {
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
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);


  const login = async (username, password) => {
    setIsLoading(true);
    const csrfToken = getCsrfToken(); // Fetch CSRF token right before using it
    console.log("CSRF Token being sent:", csrfToken);

    try {
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
    const csrfToken = getCsrfToken();
    try {
      const response = await fetch(`${config.API_BASE_URL}/accounts/logout/`, {
        method: 'POST',
        headers: {
          "X-CSRFToken": csrfToken,
        },
        credentials: 'include',
      });
      if (response.ok) {
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
