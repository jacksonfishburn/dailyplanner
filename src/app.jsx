import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Routes, Route } from 'react-router-dom';
import Login from './login/login';
import Plan from './plan/plan';
import Items from './items/items';
import About from './about/about';
import { Navigate } from 'react-router-dom';

export default function App() {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const socketRef = React.useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (!currentUser) {
      return undefined;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.port === '5173'
      ? `${window.location.hostname}:4000`
      : window.location.host;
    const socket = new WebSocket(`${wsProtocol}//${wsHost}`);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type !== 'state-sync') {
          return;
        }

        const payload = message.payload ?? {};
        if (Array.isArray(payload.items)) {
          setItems(payload.items);
        }
        if (Array.isArray(payload.schedule)) {
          setSchedule(payload.schedule);
        }
      } catch {
      }
    };

    socketRef.current = socket;

    return () => {
      socket.close();
      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [currentUser]);

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
                    <NavLink className="nav-link" to="">Login</NavLink>
                  </li>
                  {currentUser && (
                    <>
                      <li>
                        <NavLink className="nav-link" to="plan">Plan Day</NavLink>
                      </li>
                      <li>
                        <NavLink className="nav-link" to="items">Manage Items</NavLink>
                      </li>
                    </>
                  )}
                  <li>
                    <NavLink className="nav-link" to="about">About</NavLink>
                  </li>
                </ul>
              </nav>
            </div>
            <p className="user-banner">
              <span id="username">{currentUser ? currentUser : 'Sign in'}</span>
            </p>
          </div>
        </header>

        <main>
          <Routes>
            <Route path='/' element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} setItems={setItems} setSchedule={setSchedule} />} exact />
            <Route path='/plan' element={currentUser ? <Plan items={items} setItems={setItems} schedule={schedule} setSchedule={setSchedule} /> : <Navigate to="/" replace />} />
            <Route path='/items' element={currentUser ? <Items items={items} setItems={setItems} /> : <Navigate to="/" replace />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>

        <footer>
          <hr />
          <span className="text-reset">Jackson Fishburn</span>
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