import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ users, setUsers }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = () => {
    if (users.hasOwnProperty(email)) {
      setErrorMessage('Username taken');
      return;
    }

    users[email] = password;

    setErrorMessage('Registration successful');

    setEmail('');
    setPassword('');
    setUsers(users);

    navigate('/plan');
  };

  const handleLogin = () => {
    if (users.hasOwnProperty(email) && users[email] === password) {
      setErrorMessage('Login successful');

      setEmail('');
      setPassword('');
      setUsers(users); 

      navigate('/plan');
    } else {
      setErrorMessage('Username or password not found');
    }
  };

  return (
    <div className='login-container'>
      <section className="login">
        <h1>Start Planning</h1>
        <form>
          <div className="email">
            <label>Email:</label>
            <input
              className='login-input'
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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