import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ users, setUsers, setCurrentUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

const handleRegister = () => {
  if (users.hasOwnProperty(user)) {
    setErrorMessage('Username taken');
    return;
  }

  const updatedUsers = { ...users, [user]: password };
  setUsers(updatedUsers);

  setUser('');
  setPassword('');
  setCurrentUser(user);
  navigate('/plan');
};

  const handleLogin = () => {
    if (users.hasOwnProperty(user) && users[user] === password) {
      setUser('');
      setPassword('');
      setUsers(users); 

      setCurrentUser(user);
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
            <label>Username:</label>
            <input
              className='login-input'
              type="text"
              placeholder="Enter username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
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