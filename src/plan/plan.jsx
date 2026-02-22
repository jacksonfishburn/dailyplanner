import React, { useState, useMemo, useEffect } from 'react';
import './plan.css';
import { useNavigate } from 'react-router-dom';
import Schedule from './schedule';


export default function Plan({ items, setItems }) {
  const [scheduledItems, setScheduledItems] = useState(() => {
    const saved = localStorage.getItem('scheduledItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [listDragOver, setListDragOver] = useState(false);
  const navigate = useNavigate();
  const pixelsPerMinute = 3;

  useEffect(() => {
    localStorage.setItem('scheduledItems', JSON.stringify(scheduledItems));
  }, [scheduledItems]);

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
      const hasOverlap = others.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
      if (hasOverlap) return prev;
      const exists = prev.find(s => s.id === item.id);
      if (exists) return prev.map(s => s.id === item.id ? { ...s, startMin } : s);
      return [...prev, { ...item, startMin }];
    });
  };

  const handleDropOnList = (e) => {
    e.preventDefault();
    setListDragOver(false);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const item = JSON.parse(raw);
    if (item.source !== 'scheduled') return;
    setScheduledItems(prev => prev.filter(s => s.id !== item.id));
  };

  const handleListDragOver = (e) => {
    if (window.__dragSource !== 'scheduled') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setListDragOver(true);
  };

  const handleListDragLeave = () => setListDragOver(false);

  const itemProps = (item) => ({
    draggable: true,
    onDragStart: (e) => {
      const ghost = new Image();
      e.dataTransfer.setDragImage(ghost, 0, 0);   
      e.dataTransfer.setData('application/json', JSON.stringify(item));
      window.__dragItem = item;
      window.__dragSource = 'list';
      e.currentTarget.style.opacity = '0.5';
    },
    onDragEnd: (e) => {
      e.currentTarget.style.opacity = '1';
      window.__dragItem = null;
      window.__dragSource = null;
    },
    style: { height: `${item.time * pixelsPerMinute}px`, cursor: 'grab' },
  });

  const listProps = {
    onDragOver: handleListDragOver,
    onDragLeave: handleListDragLeave,
    onDrop: handleDropOnList,
  };

  return (
    <div className="plan-container">
      <div className={`lists${listDragOver ? ' list-drop-target' : ''}`} {...listProps}>
        <div className="outside">
          <h3>One-time</h3>
          <form onSubmit={(e) => { e.preventDefault(); navigate('/items'); }}>
            <button type="submit" className="plan-add-button">+</button>
          </form>
        </div>
        <ul className="item-list">
          {oneTimeItems
            .filter(item => !scheduledOneTimeIds.has(item.id))
            .map(item => (
              <li key={item.id} className="item" {...itemProps(item)}>
                <span className="item-name">{item.name}</span>
                <span className="item-duration">{item.time}m</span>
              </li>
            ))}
        </ul>
      </div>

      <Schedule
        scheduledItems={scheduledItems}
        onDrop={handleDropOnSchedule}
      />

      <div className={`lists${listDragOver ? ' list-drop-target' : ''}`} {...listProps}>
        <div className="outside">
          <h3>Recurring</h3>
          <form onSubmit={(e) => { e.preventDefault(); navigate('/items'); }}>
            <button type="submit" className="plan-add-button">+</button>
          </form>
        </div>
        <ul className="item-list">
          {recurringItems.map(item => (
            <li key={item.id} className="item" {...itemProps(item)}>
              <span className="item-name">{item.name}</span>
              <span className="item-duration">{item.time}m</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}