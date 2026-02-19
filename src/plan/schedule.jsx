import React from "react";

export default function Schedule({scheduledItems, setScheduledItems}) {
  const pixelsPerMinute = 2;
  const hourHeight = 60 * pixelsPerMinute;

  const hours = [8,9,10,11,12,13,14,15,16,17,18,19,20];


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

            <div className="graph">
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
                    height: `${it.time * pixelsPerMinute}px`,
                  }}
                  >
                    <div className="schedule-item-name">{it.name}</div>
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
