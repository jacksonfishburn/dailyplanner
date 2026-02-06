import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import Login from './login/login';
import Plan from './plan/plan';
import Items from './items/items';
import About from './about/about';

export default function App() {
  return (
    <BrowserRouter>
      <div className="body">
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className='header-title'>PlanMyDay</h1>
              <nav>
                <ul className="nav-links">
                  <li>
                    <NavLink className="nav-link" to="">
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="plan">
                      Plan day
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="items">
                      Manage Items
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="nav-link" to="about">
                      About
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
            <p className="user-banner">
              <span id="username">User Name</span>
            </p>
          </div>
        </header>

        <Routes>
          <Route path='/' element={<Login />} exact />
          <Route path='/plan' element={<Plan />} />
          <Route path='/items' element={<Items />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Routes>  
        <main></main>

        <footer>
          <hr />
          <span class="text-reset">Jackson Fishburn</span>
          <br />
          <a href="https://github.com/jacksonfishburn/dailyplanner">GitHub</a>
        </footer>

      </div>
    </BrowserRouter>
);
}

function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}
