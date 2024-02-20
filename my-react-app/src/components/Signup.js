import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCsrfToken from '../hooks/useCsrfToken';


function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const csrfToken = useCsrfToken();
  console.log("CSRF Token:", csrfToken);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }


    try {
      const response = await fetch('http://localhost:8000/accounts/signup/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken.csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        console.log("Signup successful");
        navigate('/login');
      } else {
        const data = await response.json();
        setError(data.error || 'An unknown error occurred');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError('Failed to submit form');
    }
  };

  return (
    <div className="container mt-5 mx-auto w-50">
      <h4>Signup</h4>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupForm;
