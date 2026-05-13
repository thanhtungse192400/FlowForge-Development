import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function BoardColumn({ column, onTaskClick }) {
  const { title, accent, tasks } = column;

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      className={`CP-Column ${isOver ? "CP-Column--over" : ""}`}
      ref={setNodeRef}
    >
      <div className="CP-Column__header">
        <div className="CP-Column__header-left">
          <span className="CP-Column__dot" style={{ background: accent }} />
          <span className="CP-Column__title">{title}</span>
          <span className="CP-Column__count">{tasks.length}</span>
        </div>
      </div>

      <div className="CP-Column__body">
        {tasks.length === 0 ? (
          <div className="CP-Column__empty">No tasks</div>
        ) : (
          tasks.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              accent={accent}
              index={i}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}