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

  useEffect(() => {
      setCsrfToken(getCookie('csrftoken'));
  }, [getCookie]);

  const updateCsrfToken = () => setCsrfToken(getCookie('csrftoken'));

  return { csrfToken, updateCsrfToken };
}

export default useCsrfToken;
