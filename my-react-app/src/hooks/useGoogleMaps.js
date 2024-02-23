import { useEffect, useState } from 'react';

const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  return isLoaded;
};

export default useGoogleMaps;
