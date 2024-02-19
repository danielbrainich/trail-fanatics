import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/useCsrfToken';


function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const csrfToken = useCsrfToken();
  console.log("CSRF Token:", csrfToken);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/accounts/login/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        console.log('Login successful');
        navigate('/social');
      } else {
        const data = await response.json();
        setError(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit form');
    }
  };

  return (
    <div className="container mt-5 mx-auto w-50">
        <h4>Login</h4>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
