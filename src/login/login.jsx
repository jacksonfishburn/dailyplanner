import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

const serviceUrl = 'http://localhost:3000';

export default function Login({ setCurrentUser, setItems, setSchedule }) {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch(`${serviceUrl}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: user, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.message || data.msg || 'Register failed');
        return;
      }

      setErrorMessage('');
      setCurrentUser(data.username);
      setItems([]);
      setSchedule([]);
      setUser('');
      setPassword('');
      navigate('/plan');
    } catch {
      setErrorMessage('Unable to reach service');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${serviceUrl}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: user, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.msg);
        return;
      }

      setErrorMessage('');
      setItems(data.items ?? []);
      setSchedule(data.schedule ?? []);
      setCurrentUser(data.username);
      setUser('');
      setPassword('');
      navigate('/plan');
    } catch {
      setErrorMessage('Unable to reach service');
    }
  };

  return (
    <div className='login-container'>
      <section className="login">
        <h1>Start Planning</h1>
        <form>
          <div className="email">
            <label>Username:</label>
            <input
              className='login-input'
              type="text"
              placeholder="Enter username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </div>
          <div className="password">
            <label>Password:</label>
            <input
              className='login-input'
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="actions">
            <button className='login-button' type="button" onClick={handleRegister}>Register</button>
            <button className='login-button' type="button" onClick={handleLogin}>Login</button>
          </div>
          <div className='error-message'>
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>
      </section>
    </div>
  );
}