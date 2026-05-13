import React, { useState, useMemo } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function CalendarPanel({ tasks }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday=0 offset
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = lastDay.getDate();

  // Build map of "May 15" -> count
  const dueDateMap = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (t.dueDate) map[t.dueDate] = (map[t.dueDate] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const formatLabel = (day) => {
    const m = MONTHS[month];
    return `${m.slice(0, 3)} ${day}`;
  };

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="CP-Calendar">
      <div className="CP-Calendar__header">
        <button className="CP-Calendar__nav" onClick={prevMonth}>‹</button>
        <span className="CP-Calendar__month">
          {MONTHS[month]} {year}
        </span>
        <button className="CP-Calendar__nav" onClick={nextMonth}>›</button>
      </div>

      <div className="CP-Calendar__days">
        {DAYS.map((d) => (
          <span key={d} className="CP-Calendar__day-label">{d}</span>
        ))}
      </div>

      <div className="CP-Calendar__grid">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="CP-Calendar__cell" />;
          const label = formatLabel(day);
          const hasTasks = dueDateMap[label];
          return (
            <span
              key={day}
              className={`CP-Calendar__cell ${isToday(day) ? "CP-Calendar__cell--today" : ""} ${hasTasks ? "CP-Calendar__cell--has-task" : ""}`}
            >
              {day}
              {hasTasks && <span className="CP-Calendar__dot" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
