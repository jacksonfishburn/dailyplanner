import React from 'react';
import './plan.css';
import { useNavigate } from 'react-router-dom'

export default function Plan({ items, setItems }) {
  const navigate = useNavigate();
  const pixelsPerMinute = 3;

  const handleNavigateToItems = (e) => {
    e.preventDefault();
    navigate('/items');
  };

  return (
      <div className="plan-container">
        <div className="lists">
          <div className="outside">
            <h3>One-time</h3>
            <form onSubmit={handleNavigateToItems}>
              <button type="submit" className="plan-add-button">+</button>
            </form>
            </div>
            <section>
              <ul className="item-list">
                {items
                  .filter(item => !item.isRecurring)
                  .map((item, index) => (
                    <li key={index}
                      className="item"
                      style={{ height: `${item.time * pixelsPerMinute}px` }}
                     >
                      <span className="item-name">{item.name}</span>
                      <span className="item-duration">{item.time}m</span>
                    </li>
                ))}
              </ul>
            </section>
        </div>

        <section className="schedule">
          <div className="outside">
            <h2>Schedule</h2>

            <section className="weather">
              <div>38° Sunny</div>
            </section>
          </div>

            <section className="day-grid">
              <div className="times">
                <div className="time">12pm</div>
                <div className="time">1pm</div>
                <div className="time">2pm</div>
                <div className="time">3pm</div>
              </div>
              <div className="graph">
                <div className="slot"></div>
                <div className="slot"></div>
                <div className="slot"></div>
                <div className="slot"></div>
              </div>
            </section>
        </section>

        <div className="lists">
          <div className="outside">
            <h3>Recurring</h3>
            <form onSubmit={handleNavigateToItems}>
              <button type="submit" className="plan-add-button">+</button>
            </form>
          </div>
            <ul className="item-list">
              {items
                .filter(item => item.isRecurring)
                .map((item, index) => (
                  <li 
                    key={index}
                    className="item"
                    style={{ height: `${item.time * pixelsPerMinute}px` }}
                   >
                    <span className="item-name">{item.name}</span>
                    <span className="item-duration">{item.time}m</span>
                  </li>
              ))}
            </ul>
        </div>
      </div>
  );
} 
