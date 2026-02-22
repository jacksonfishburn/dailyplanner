import React, { useState } from 'react';
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

  const handleDropOnSchedule = (item, startMin) => {
    setScheduledItems(prev => {
      const exists = prev.find(s => s.id === item.id);
      if (exists) {
        return prev.map(s => s.id === item.id ? { ...s, startMin } : s);
      }
      return [...prev, { ...item, startMin }];
    });
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
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ ...item, id: item.id ?? `one-${index}` }));
                        e.currentTarget.style.opacity = '0.5';
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      style={{ height: `${item.time * pixelsPerMinute}px`, cursor: 'grab' }}
                     >
                      <span className="item-name">{item.name}</span>
                      <span className="item-duration">{item.time}m</span>
                    </li>
                ))}
              </ul>
            </section>
        </div>

        <Schedule
          scheduledItems={scheduledItems}
          setScheduledItems={setScheduledItems}
          onDrop={handleDropOnSchedule}
        />

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
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({ ...item, id: item.id ?? `rec-${index}` }));
                      e.currentTarget.style.opacity = '0.5';
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    style={{ height: `${item.time * pixelsPerMinute}px`, cursor: 'grab' }}
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