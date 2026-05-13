import React from "react";

// Lightweight overlay card shown while dragging
export default function TaskCardDragOverlay({ task }) {
  return (
    <div className="CP-Card CP-Card--dragging">
      <div className="CP-Card__top">
        <span className="CP-Card__id">{task.id}</span>
      </div>
      <div className="CP-Card__title">{task.title}</div>
    </div>
  );
}
