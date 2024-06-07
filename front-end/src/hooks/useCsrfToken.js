import { useState, useEffect, useCallback } from 'react';

function useCsrfToken() {
    const [csrfToken, setCsrfToken] = useState('');

    const getCookie = useCallback((name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }, []);

    const fetchCsrfToken = useCallback(async () => {
        const token = await getCookie('csrftoken');
        setCsrfToken(token);
        return token;
    }, [getCookie]);

    useEffect(() => {
        fetchCsrfToken();
    }, [fetchCsrfToken]);

    return { csrfToken, fetchCsrfToken };
}

export default useCsrfToken;
