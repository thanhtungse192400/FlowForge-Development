import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { labelColors } from "../collection.data";

const PRI = {
  high:   { label: "High",   dot: "#d32f2f" },
  medium: { label: "Medium", dot: "#f9a825" },
  low:    { label: "Low",    dot: "#1976d2" },
  done:   { label: "Done",   dot: "#2e7d32" },
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

  return (
    <div
      ref={setNodeRef}
      className="CP-Card"
      style={style}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <div className="CP-Card__top">
        <span className="CP-Card__id">{task.id}</span>
        <span className="CP-Card__pri-dot" style={{ background: pri.dot }} title={pri.label} />
      </div>
      <div className="CP-Card__title">{task.title}</div>
      {task.labels?.length > 0 && (
        <div className="CP-Card__labels">
          {task.labels.map((l) => {
            const lc = labelColors[l] || { bg: "rgba(0,0,0,0.05)", text: "#666" };
            return (
              <span key={l} className="CP-Card__label" style={{ background: lc.bg, color: lc.text }}>
                {l}
              </span>
            );
          })}
        </div>
      )}
      <div className="CP-Card__bottom">
        <div className="CP-Card__meta">
          {task.subtasks?.total > 0 && (
            <span className="CP-Card__subtasks">✓ {task.subtasks.done}/{task.subtasks.total}</span>
          )}
          {task.dueDate && <span className="CP-Card__due">{task.dueDate}</span>}
        </div>
        {task.assignee && (
          <div className="CP-Card__assignee">{task.assignee}</div>
        )}
      </div>
    </div>
  );
}