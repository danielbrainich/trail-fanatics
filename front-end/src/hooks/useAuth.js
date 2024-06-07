import { useState, useEffect } from 'react';
import useCsrfToken from './useCsrfToken';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const { csrfToken, fetchCsrfToken } = useCsrfToken();
    const navigate = useNavigate();
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? '' : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    const [error, setError] = useState(null);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`${baseUrl}/accounts/current_user/`, {
                method: 'GET',
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user');
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null);
            setError('Failed to fetch user');
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
        try {
            await fetchCsrfToken(); // Fetch the latest CSRF token

            const response = await fetch(`${baseUrl}/accounts/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login was unsuccessful, Please try again.');
            }

            await fetchCsrfToken(); // Update the CSRF token
            await fetchCurrentUser();
            navigate('/welcome');
        } catch (error) {
            console.error('Login error', error);
            setError('Login was unsuccessful. Please try again.');
            throw error;
        }
    };

    const signup = async (formData) => {
        try {
            await fetchCsrfToken(); // Fetch the latest CSRF token

            const response = await fetch(`${baseUrl}/accounts/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchCsrfToken(); // Update the CSRF token
                await login(formData.username, formData.password);
                window.location.reload()
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.username
                    ? errorData.username[0]
                    : errorData.detail || 'An unknown error occurred during signup.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Signup error:", error.message);
            setError(error.message);
        }
    };

    const logout = async () => {
        try {
            await fetchCsrfToken(); // Fetch the latest CSRF token

            const response = await fetch(`${baseUrl}/accounts/logout/`, {
                method: 'POST',
                headers: {
                    "X-CSRFToken": csrfToken,
                },
                credentials: 'include',
            });

            if (response.ok) {
                await fetchCsrfToken(); // Update the CSRF token
                setUser(null);
                navigate('/');
                return true;
            } else {
                console.error('Logout failed');
                setError('Logout failed');
                return false;
            }
        } catch (error) {
            console.error('Logout error', error);
            setError('Logout error');
            return false;
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return { user, login, logout, fetchCurrentUser, updateUser, signup, setError, error };
};

export default useAuth;
