import React, { useRef, useState } from "react";

  export default function Schedule({ scheduledItems, setScheduledItems, onDrop, overlapError }) {
  const pixelsPerMinute = 2;
  const hourHeight = 60 * pixelsPerMinute;
  const startHour = 8;

  const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20];

  const graphRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const getStartMin = (clientY) => {
    const rect = graphRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const totalMinutes = Math.max(0, Math.round(relativeY / pixelsPerMinute));
    const snapped = Math.round(totalMinutes / 15) * 15;
    return snapped;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const item = JSON.parse(raw);
    const startMin = getStartMin(e.clientY);
    onDrop(item, startMin);
  };

  return (
    <section className="schedule">
      <div className="outside">
        <h2>Schedule</h2>
        <section className="weather">
            {/* add call to third party later */}
          <div>38° Sunny</div> 
        </section>
      </div>

      <div className="day-grid">
        <div className="scroll-area">
            <div className="times">
            {hours.map((h) => (
                <div key={h} className="time" style={{ height: `${hourHeight}px` }}>
                {formatHour(h)}
                </div>
            ))}
            </div>

            <div
              className={`graph${dragOver ? ' drag-over' : ''}${overlapError ? ' overlap-error' : ''}`}
              ref={graphRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
            {hours.map((h) => (
                <div key={h} className="slot" style={{ height: `${hourHeight}px` }} />
            ))}
              <div className="schedule-items">
                {scheduledItems.map((it, index) => (
                  <div
                    key={index}
                    className="schedule-item"
                    style={{
                      top: `${it.startMin * pixelsPerMinute}px`,
                      height: `${Math.max(it.time * pixelsPerMinute, 24)}px`,
                    }}
                  >
                    <div className="schedule-item-name">{it.name}</div>
                    <div className="schedule-item-time">{it.time}m</div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}

function formatHour(h) {
  const hour = ((h + 11) % 12) + 1;
  const suffix = h >= 12 ? "pm" : "am";
  return `${hour}${suffix}`;
}