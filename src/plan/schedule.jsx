import React, { useEffect, useRef, useState } from "react";

async function fetchOpenMeteoWeather() {
  const defaultCoords = { latitude: 40.2338, longitude: -111.6585 };

  const coords = await new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(defaultCoords);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => resolve(defaultCoords),
      { timeout: 5000 }
    );
  });

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=fahrenheit`
  );

  if (!weatherRes.ok) {
    throw new Error('Weather request failed');
  }

  const weather = await weatherRes.json();
  const current = weather?.current_weather;
  if (!current || typeof current.temperature !== 'number') {
    throw new Error('Weather data missing');
  }

  return {
    temperature: Math.round(current.temperature),
    weatherCode: current.weathercode,
  };
}

async function getWeather() {
  const { temperature, weatherCode } = await fetchOpenMeteoWeather();

  let condition = 'Cloudy';
  if (weatherCode === 0) {
    condition = 'Sunny';
  } else if (weatherCode === 1 || weatherCode === 2) {
    condition = 'Partly Cloudy';
  } else if (
    weatherCode === 51 || weatherCode === 53 || weatherCode === 55 ||
    weatherCode === 56 || weatherCode === 57 ||
    weatherCode === 61 || weatherCode === 63 || weatherCode === 65 ||
    weatherCode === 66 || weatherCode === 67 ||
    weatherCode === 80 || weatherCode === 81 || weatherCode === 82
  ) {
    condition = 'Raining';
  } else if (
    weatherCode === 71 || weatherCode === 73 || weatherCode === 75 ||
    weatherCode === 77 || weatherCode === 85 || weatherCode === 86
  ) {
    condition = 'Snowing';
  }

  return `${temperature}° ${condition}`;
}

export default function Schedule({ schedule, onDrop, onClear }) {
  const pixelsPerMinute = 2;
  const hourHeight = 60 * pixelsPerMinute;
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const graphRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragPreview, setDragPreview] = useState(null);
  const [weatherText, setWeatherText] = useState('Loading weather...');

  useEffect(() => {
    let active = true;

    async function loadWeather() {
      try {
        const weather = await getWeather();
        if (active) {
          setWeatherText(weather);
        }
      } catch {
        if (active) {
          setWeatherText('Weather unavailable');
        }
      }
    }

    loadWeather();

    return () => {
      active = false;
    };
  }, []);

  const getStartMin = (clientY) => {
    const rect = graphRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const totalMinutes = Math.max(0, Math.round(relativeY / pixelsPerMinute));
    return Math.round(totalMinutes / 15) * 15;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
    if (window.__dragItem) {
      setDragPreview({ ...window.__dragItem, startMin: getStartMin(e.clientY) });
    }
  };

  const handleDragLeave = (e) => {
    if (!graphRef.current.contains(e.relatedTarget)) {
      setDragOver(false);
      setDragPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setDragPreview(null);
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const item = JSON.parse(raw);
    window.__dragItem = null;
    window.__dragSource = null;
    onDrop(item, getStartMin(e.clientY));
  };

  return (
    <section className="schedule">
      <div className="outside">
        <h2>Schedule</h2>
        <section className="weather">
          <div>{weatherText}</div>
        </section>
      </div>

      <div className="day-grid">
        <div className="scroll-area">
          <div className="times">
            {hours.map(h => (
              <div key={h} className="time" style={{ height: `${hourHeight}px` }}>
                {formatHour(h)}
              </div>
            ))}
          </div>

          <div
            className={`graph${dragOver ? ' drag-over' : ''}`}
            ref={graphRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {hours.map(h => (
              <div key={h} className="slot" style={{ height: `${hourHeight}px` }} />
            ))}

            <div className="schedule-items">
              {dragPreview && (
                <div
                  className="schedule-item drag-preview"
                  style={{
                    top: `${dragPreview.startMin * pixelsPerMinute}px`,
                    height: `${Math.max(dragPreview.time * pixelsPerMinute, 24)}px`,
                    pointerEvents: 'none',
                  }}
                >
                  <div className="schedule-item-name">{dragPreview.name}</div>
                  <div className="schedule-item-time">{dragPreview.time}m</div>
                </div>
              )}

              {schedule.map((it, index) => (
                <div
                  key={index}
                  className="schedule-item"
                  draggable
                  onDragStart={(e) => {
                    const ghost = new Image();
                    e.dataTransfer.setDragImage(ghost, 0, 0);
                    e.dataTransfer.setData('application/json', JSON.stringify({ ...it, source: 'scheduled' }));
                    window.__dragItem = it;
                    window.__dragSource = 'scheduled';
                    e.currentTarget.style.opacity = '0.4';
                  }}
                  onDragEnd={(e) => {
                    e.currentTarget.style.opacity = '1';
                    window.__dragItem = null;
                    window.__dragSource = null;
                  }}
                  style={{
                    top: `${it.startMin * pixelsPerMinute}px`,
                    height: `${Math.max(it.time * pixelsPerMinute, 24)}px`,
                    cursor: 'grab',
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
      <div className="schedule-footer">
        <button className="clear-button" onClick={onClear}>Clear Day</button>
      </div>
    </section>
  );
}

function formatHour(h) {
  const hour = ((h + 11) % 12) + 1;
  const suffix = h >= 12 ? "pm" : "am";
  return `${hour}${suffix}`;
}