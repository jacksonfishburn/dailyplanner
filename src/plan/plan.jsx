import React from 'react';
import './plan.css';
import { useNavigate } from 'react-router-dom'
import Schedule from './schedule';

export default function Plan({ items, setItems }) {
  const [scheduledItems, setScheduledItems] = useState([]);
  const navigate = useNavigate();
  const pixelsPerMinute = 3;

  const handleNavigateToItems = (e) => {
    e.preventDefault();
    navigate('/items');
  };

  const oneTime = items.filter(item => !item.isRecurring);

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
          <Schedule
            scheduledItems={scheduledItems}
            setScheduledItems={setScheduledItems}
          />
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
