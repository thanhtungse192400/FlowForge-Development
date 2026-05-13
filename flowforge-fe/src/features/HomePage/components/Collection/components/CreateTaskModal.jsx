import React, { useState } from "react";

export default function CreateTaskModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [labels, setLabels] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: `FLOW-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      labels: labels.split(",").map((l) => l.trim()).filter(Boolean),
      assignee: assignee.trim() || null,
      dueDate: null,
      subtasks: { done: 0, total: 0 },
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreate(newTask);
  };

  return (
    <div className="CP-Modal__overlay" onClick={onClose}>
      <div className="CP-Modal CP-Modal--create" onClick={(e) => e.stopPropagation()}>
        <div className="CP-Modal__header">
          <span className="CP-Modal__id">New Task</span>
          <button className="CP-Modal__close" onClick={onClose}>✕</button>
        </div>

        <form className="CP-CreateForm" onSubmit={handleSubmit}>
          <div className="CP-CreateForm__group">
            <label className="CP-CreateForm__label">Title *</label>
            <input
              className="CP-CreateForm__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div className="CP-CreateForm__group">
            <label className="CP-CreateForm__label">Description</label>
            <textarea
              className="CP-CreateForm__textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details…"
              rows={3}
            />
          </div>

          <div className="CP-CreateForm__row">
            <div className="CP-CreateForm__group CP-CreateForm__group--half">
              <label className="CP-CreateForm__label">Priority</label>
              <select
                className="CP-CreateForm__select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🔵 Low</option>
              </select>
            </div>

            <div className="CP-CreateForm__group CP-CreateForm__group--half">
              <label className="CP-CreateForm__label">Assignee</label>
              <input
                className="CP-CreateForm__input"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Initials e.g. TT"
              />
            </div>
          </div>

          <div className="CP-CreateForm__group">
            <label className="CP-CreateForm__label">Labels</label>
            <input
              className="CP-CreateForm__input"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="backend, frontend, security…"
            />
          </div>

          <div className="CP-CreateForm__actions">
            <button type="button" className="CP-CreateForm__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="CP-CreateForm__submit" disabled={!title.trim()}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
