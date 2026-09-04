import React, { useState } from "react";
import { useProjectMembers } from "../../../../Project/hooks/useProjectMembers";

export default function CreateTaskModal({ projectId, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { members } = useProjectMembers(projectId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        assignedToId: assignedToId || null,
      });
    } catch (err) {
      console.error("Create task error:", err);
    } finally {
      setIsSubmitting(false);
    }
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

          <div className="CP-CreateForm__group">
            <label className="CP-CreateForm__label">Assignee</label>
            <select
              className="CP-CreateForm__select"
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.userName || m.userId}
                </option>
              ))}
            </select>
          </div>

          <div className="CP-CreateForm__actions">
            <button type="button" className="CP-CreateForm__cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="CP-CreateForm__submit"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

