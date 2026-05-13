import React, { useMemo } from "react";

export default function OverduePanel({ tasks, onTaskClick }) {
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter((t) => {
      if (!t.dueDate || t.status === "done") return false;
      // Parse "May 18" style dates
      const parsed = new Date(`${t.dueDate}, ${today.getFullYear()}`);
      return parsed < today;
    });
  }, [tasks]);

  return (
    <div className="CP-Overdue">
      <div className="CP-Overdue__header">
        <span className="CP-Overdue__title">Overdue Tasks</span>
        {overdueTasks.length > 0 && (
          <span className="CP-Overdue__badge">{overdueTasks.length}</span>
        )}
      </div>

      <div className="CP-Overdue__list">
        {overdueTasks.length === 0 ? (
          <div className="CP-Overdue__empty">
            <span className="CP-Overdue__empty-icon">✓</span>
            <span>All caught up!</span>
          </div>
        ) : (
          overdueTasks.map((task) => (
            <div
              key={task.id}
              className="CP-Overdue__item"
              onClick={() => onTaskClick(task)}
            >
              <div className="CP-Overdue__item-top">
                <span className="CP-Overdue__item-id">{task.id}</span>
                <span className="CP-Overdue__item-due">Due: {task.dueDate}</span>
              </div>
              <div className="CP-Overdue__item-title">{task.title}</div>
              <div className="CP-Overdue__item-status">
                Status: <strong>{task.status.replace("-", " ")}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
