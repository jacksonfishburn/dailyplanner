import React, { useState, useMemo } from 'react';
import './plan.css';
import { useNavigate } from 'react-router-dom';
import Schedule from './schedule';

const serviceUrl = 'http://localhost:4000';

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

  const handleDropOnSchedule = async (item, startMin) => {
    const endMin = startMin + item.time;
    if (item.isRecurring) {
      if (item.source === 'scheduled') {
        const others = schedule.filter(s => s.id !== item.id);
        const hasOverlap = others.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
        if (hasOverlap) return;

        const response = await fetch(`${serviceUrl}/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...item, startMin }),
        });

        if (!response.ok) return;
        const data = await response.json().catch(() => ({}));
        setSchedule(data.schedule ?? schedule);
        return;
      }

      const hasOverlap = schedule.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
      if (hasOverlap) return;

      const response = await fetch(`${serviceUrl}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...item, id: crypto.randomUUID(), startMin }),
      });

      if (!response.ok) return;
      const data = await response.json().catch(() => ({}));
      setSchedule(data.schedule ?? schedule);
      return;
    }

    const others = schedule.filter(s => s.id !== item.id);
    const hasOverlap = others.some(s => startMin < s.startMin + s.time && endMin > s.startMin);
    if (hasOverlap) return;

    const response = await fetch(`${serviceUrl}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...item, startMin }),
    });

    if (!response.ok) return;
    const data = await response.json().catch(() => ({}));
    setSchedule(data.schedule ?? schedule);
  };

  const handleDropOnList = async (e) => {
    e.preventDefault();
    setListDragOver(false);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const item = JSON.parse(raw);
    if (item.source !== 'scheduled') return;

    const response = await fetch(`${serviceUrl}/schedule/${item.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) return;
    const data = await response.json().catch(() => ({}));
    setSchedule(data.schedule ?? schedule.filter(s => s.id !== item.id));
  };

  const handleListDragOver = (e) => {
    if (window.__dragSource !== 'scheduled') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setListDragOver(true);
  };

  const handleListDragLeave = () => setListDragOver(false);

  const handleClear = async () => {
    const scheduleIds = schedule.map((s) => s.id);
    const deletedIds = new Set();
    const oneTimeScheduledIds = [...new Set(schedule.filter((s) => !s.isRecurring).map((s) => s.id))];
    const deletedItemIds = new Set();

    await Promise.all(
      scheduleIds.map(async (id) => {
        try {
          const response = await fetch(`${serviceUrl}/schedule/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (response.ok) {
            deletedIds.add(id);
          }
        } catch {
        }
      })
    );

    await Promise.all(
      oneTimeScheduledIds.map(async (id) => {
        try {
          const response = await fetch(`${serviceUrl}/item/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (response.ok) {
            deletedItemIds.add(id);
          }
        } catch {
        }
      })
    );

    setItems(prev => prev.filter(item => !deletedItemIds.has(item.id)));
    setSchedule(prev => prev.filter(s => !deletedIds.has(s.id)));
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