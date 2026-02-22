import React, { useState, useMemo } from 'react';
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

  const oneTimeItems = useMemo(() =>
    items
      .filter(item => !item.isRecurring)
      .map((item, index) => ({ ...item, id: item.id ?? `one-${index}` })),
    [items]
  );

  const recurringItems = useMemo(() =>
    items
      .filter(item => item.isRecurring)
      .map((item, index) => ({ ...item, id: item.id ?? `rec-${index}` })),
    [items]
  );

  const scheduledOneTimeIds = new Set(
    scheduledItems.filter(s => !s.isRecurring).map(s => s.id)
  );

  const handleDropOnSchedule = (item, startMin) => {
    const endMin = startMin + item.time;
    setScheduledItems(prev => {
      const others = prev.filter(s => s.id !== item.id);
      const hasOverlap = others.some(s => {
        const sEnd = s.startMin + s.time;
        return startMin < sEnd && endMin > s.startMin;
      });
      if (hasOverlap) return prev;
      const exists = prev.find(s => s.id === item.id);
      if (exists) {
        return prev.map(s => s.id === item.id ? { ...s, startMin } : s);
      }
      return [...prev, { ...item, startMin }];
    });
  };

  const handleDropOnList = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const item = JSON.parse(raw);
    if (item.source !== 'scheduled') return;
    setScheduledItems(prev => prev.filter(s => s.id !== item.id));
  };

  const handleListDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
      <div className="plan-container">
        <div className="lists" onDragOver={handleListDragOver} onDrop={handleDropOnList}>
          <div className="outside">
            <h3>One-time</h3>
            <form onSubmit={handleNavigateToItems}>
              <button type="submit" className="plan-add-button">+</button>
            </form>
            </div>
            <section>
              <ul className="item-list">
                {oneTimeItems
                  .filter(item => !scheduledOneTimeIds.has(item.id))
                  .map((item) => (
                    <li key={item.id}
                      className="item"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
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

        <div className="lists" onDragOver={handleListDragOver} onDrop={handleDropOnList}>
          <div className="outside">
            <h3>Recurring</h3>
            <form onSubmit={handleNavigateToItems}>
              <button type="submit" className="plan-add-button">+</button>
            </form>
          </div>
            <ul className="item-list">
              {recurringItems.map((item) => (
                  <li
                    key={item.id}
                    className="item"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(item));
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