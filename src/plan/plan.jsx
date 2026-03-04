import React, { useState, useMemo } from 'react';
import './plan.css';
import { useNavigate } from 'react-router-dom';
import Schedule from './schedule';

export default function Plan({ items, setItems, schedule, setSchedule }) {
  const [listDragOver, setListDragOver] = useState(false);
  const navigate = useNavigate();
  const pixelsPerMinute = 3;

  const oneTimeItems = useMemo(() =>
    items.filter(item => !item.isRecurring),
    [items]
  );

  const recurringItems = useMemo(() =>
    items.filter(item => item.isRecurring),
    [items]
  );

  const scheduledOneTimeIds = useMemo(() =>
    new Set(schedule.filter(s => !s.isRecurring).map(s => s.id)),
    [schedule]
  );

  const handleDropOnSchedule = (item, startMin) => {
    const endMin = startMin + item.time;
    setSchedule(prev => {
      if (item.isRecurring) {
        if (item.source === 'scheduled') {
          const others = prev.filter(s => s.id !== item.id);
          const hasOverlap = others.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
          if (hasOverlap) return prev;
          return prev.map(s => s.id === item.id ? { ...s, startMin } : s);
        }

        const hasOverlap = prev.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
        if (hasOverlap) return prev;
        return [...prev, { ...item, id: crypto.randomUUID(), startMin }];
      }
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
    setSchedule(prev => prev.filter(s => s.id !== item.id));
  };

  const handleListDragOver = (e) => {
    if (window.__dragSource !== 'scheduled') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setListDragOver(true);
  };

  const handleListDragLeave = () => setListDragOver(false);

  const handleClear = () => {
    const toDelete = new Set(schedule.filter(s => !s.isRecurring).map(s => s.id));
    setItems(prev => prev.filter(item => !toDelete.has(item.id)));
    setSchedule([]);
  };

  const itemProps = (item) => ({
    draggable: true,
    onDragStart: (e) => {
      const ghost = new Image();
      e.dataTransfer.setDragImage(ghost, 0, 0);
      e.dataTransfer.setData('application/json', JSON.stringify({ ...item, source: 'list' }));
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
        <div className="item-list-scroll">
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
      </div>

      <Schedule
        schedule={schedule}
        onDrop={handleDropOnSchedule}
        onClear={handleClear}
      />

      <div className={`lists${listDragOver ? ' list-drop-target' : ''}`} {...listProps}>
        <div className="outside">
          <h3>Recurring</h3>
          <form onSubmit={(e) => { e.preventDefault(); navigate('/items'); }}>
            <button type="submit" className="plan-add-button">+</button>
          </form>
        </div>
        <div className="item-list-scroll">
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
    </div>
  );
}