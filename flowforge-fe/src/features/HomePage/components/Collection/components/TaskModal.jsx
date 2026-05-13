import React from "react";

export default function TaskModal({ task, columns, onClose, onDelete, onMove }) {
  const currentCol = columns.find((c) => c.tasks.some((t) => t.id === task.id));

  return (
    <div className="CP-Modal__overlay" onClick={onClose}>
      <div className="CP-Modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="CP-Modal__header">
          <span className="CP-Modal__id">{task.id}</span>
          <button className="CP-Modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Title */}
        <h2 className="CP-Modal__title">{task.title}</h2>

        {/* Description */}
        {task.description && (
          <p className="CP-Modal__desc">{task.description}</p>
        )}

        {/* Meta Grid */}
        <div className="CP-Modal__grid">
          <div className="CP-Modal__field">
            <span className="CP-Modal__field-label">Status</span>
            <span className="CP-Modal__field-value">{currentCol?.title || "—"}</span>
          </div>
          <div className="CP-Modal__field">
            <span className="CP-Modal__field-label">Priority</span>
            <span className={`CP-Modal__field-value CP-Modal__pri--${task.priority}`}>
              {task.priority}
            </span>
          </div>
          <div className="CP-Modal__field">
            <span className="CP-Modal__field-label">Assignee</span>
            <span className="CP-Modal__field-value">{task.assignee || "Unassigned"}</span>
          </div>
          <div className="CP-Modal__field">
            <span className="CP-Modal__field-label">Due Date</span>
            <span className="CP-Modal__field-value">{task.dueDate || "No due date"}</span>
          </div>
        </div>

        {/* Labels */}
        {task.labels?.length > 0 && (
          <div className="CP-Modal__labels">
            <span className="CP-Modal__field-label">Labels</span>
            <div className="CP-Modal__labels-list">
              {task.labels.map((l) => (
                <span key={l} className="CP-Modal__label-tag">{l}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="CP-Modal__actions">
          <span className="CP-Modal__field-label">Move to</span>
          <div className="CP-Modal__move-btns">
            {columns
              .filter((c) => c.id !== currentCol?.id)
              .map((c) => (
                <button
                  key={c.id}
                  className="CP-Modal__move-btn"
                  style={{ borderColor: c.accent }}
                  onClick={() => onMove(task.id, c.id)}
                >
                  {c.title}
                </button>
              ))}
          </div>
        </div>

        {/* Delete */}
        <div className="CP-Modal__footer">
          <button className="CP-Modal__delete-btn" onClick={() => onDelete(task.id)}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
