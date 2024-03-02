import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../contexts/AuthContext";



function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthContext();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      console.log('Login successful');
      navigate('/social');
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'Unknown error occurred');
    }
  };


  return (
    <div className="container mt-3 mt-md-5 mx-auto w-50">
        <h5>Login</h5>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor="username" className="form-label">Username</label>
        <div className="mb-4">
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
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
