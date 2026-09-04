import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { labelColors } from "../collection.data";

const PRI = {
  high:   { label: "High",   dot: "#ef4444", icon: "↑" },
  medium: { label: "Medium", dot: "#f59e0b", icon: "＝" },
  low:    { label: "Low",    dot: "#3b82f6", icon: "↓" },
  done:   { label: "Done",   dot: "#10b981", icon: "✓" },
};

export default function TaskCard({ task, accent, index, onClick }) {
  const pri = PRI[task.priority] || PRI.low;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.4 : 1,
    animationDelay: `${index * 0.04}s`,
  };

  // Convert UUID to short TASK-1234 format
  const displayId = task.id && task.id.length > 12
    ? `TASK-${task.id.slice(0, 4).toUpperCase()}`
    : task.id;

  return (
    <div
      ref={setNodeRef}
      className="CP-Card"
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="CP-Card__title">{task.title}</div>
      {task.labels?.length > 0 && (
        <div className="CP-Card__labels">
          {task.labels.map((l) => {
            const lc = labelColors[l] || { bg: "rgba(0,0,0,0.05)", text: "#5e6c84" };
            return (
              <span key={l} className="CP-Card__label" style={{ background: lc.bg, color: lc.text }}>
                {l}
              </span>
            );
          })}
        </div>
      )}
      <div className="CP-Card__footer">
        <div className="CP-Card__footer-left">
          <div className="CP-Card__type-icon">☑</div>
          <span className="CP-Card__id">{displayId}</span>
        </div>
        <div className="CP-Card__footer-right">
          <div className="CP-Card__pri-icon" style={{ color: pri.dot }} title={pri.label}>{pri.icon}</div>
          {task.assignee ? (
            <div className="CP-Card__assignee" title={task.assignee}>{task.assignee.charAt(0).toUpperCase()}</div>
          ) : (
            <div className="CP-Card__unassigned" title="Unassigned">👤</div>
          )}
        </div>
      </div>
    </div>
  );
}