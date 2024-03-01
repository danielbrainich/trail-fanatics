const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_BASE_URL_PROD
  : process.env.REACT_APP_API_BASE_URL_DEV;


  const config = {API_BASE_URL};

  export default config;
