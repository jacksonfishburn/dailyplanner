import React from 'react';
import './login.css'
import { useNavigate } from 'react-router-dom'


export default function Login() {
  const navigate = useNavigate();

  const handleNavigateToItems = (e) => {
    e.preventDefault();
    navigate('/plan');
  };

  return (
    <div className='login-container'>
      <section className="login">
        <h1>Start Planning</h1>
        <form onSubmit={handleNavigateToItems}>
          <div className="email">
              <label>Email:</label>
              <input className='login-input' type="text" placeholder="Enter email" />
          </div>
          <div className="password">
              <label>Password:</label>
              <input className='login-input' type="password" placeholder="Enter password" />
          </div>
          <div className="actions">
              <button className='login-button' type="submit">Login</button>
              <button className='login-button' type="submit">Register</button>
          </div>
        </form>
      </section>
    </div>
  );
}
