import React, { useState, useRef, useEffect } from "react";
import { useTaskComments } from "../../../../Task/hooks/useTaskComments";
import { useTasks } from "../../../../Task/hooks/useTasks";
import { useProjectMembers } from "../../../../Project/hooks/useProjectMembers";
import Popup from "../../../../../shared/components/NotificationPop/Popup";

export default function TaskModal({ task, columns, onClose, onDelete, onMove }) {
  // Tạo local state cho task để UI cập nhật ngay khi chọn member mới
  const [localTask, setLocalTask] = useState(task);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const currentCol = columns.find((c) => c.tasks.some((t) => t.id === localTask.id));
  const { comments, isLoading, addComment, isSubmitting } = useTaskComments(localTask.id);
  const { members } = useProjectMembers(localTask.projectId);
  const { updateTask } = useTasks(localTask.projectId);
  const [newComment, setNewComment] = useState("");
  
  const commentsEndRef = useRef(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    const result = await addComment(newComment);
    if (result.success) {
      setNewComment('');
    } else {
      setPopupMessage(result.message || "Có lỗi xảy ra khi đăng bình luận.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleAssigneeChange = async (userId) => {
    try {
      // Cập nhật UI ngay lập tức
      const updatedTask = { ...localTask, assignedToId: userId };
      setLocalTask(updatedTask);
      
      await updateTask({ taskId: localTask.id, data: updatedTask }); 
      
      setPopupMessage("Assignee updated successfully!");
      setPopupType("success");
      setShowPopup(true);
    } catch (err) {
      console.error("Lỗi:", err);
      setPopupMessage("Failed to update assignee");
      setPopupType("error");
      setShowPopup(true);
      // Rollback UI nếu lỗi
      setLocalTask(task); 
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handlePost();
  };

  const displayId = localTask.id && localTask.id.length > 12
    ? localTask.id.slice(0, 8).toUpperCase()
    : localTask.id;

  return (
    <div className="CP-Modal__overlay" onClick={onClose}>
      {showPopup && (
        <Popup 
          message={popupMessage} 
          type={popupType} 
          onClose={() => setShowPopup(false)} 
        />
      )}
      
      <div className="CP-Modal" onClick={(e) => e.stopPropagation()}>
        <div className="CP-Modal__header">
          <div className="CP-Modal__header-left">
            <span className="CP-Modal__type-icon">☑</span>
            <span className="CP-Modal__id">{displayId}</span>
          </div>
          <button className="CP-Modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="CP-Modal__content">
          <div className="CP-Modal__main">
            <h2 className="CP-Modal__title">{localTask.title}</h2>
            
            <div className="CP-Modal__section">
              <h3 className="CP-Modal__section-title">Description</h3>
              <div className="CP-Modal__desc-box">
                {localTask.description ? (
                  <p className="CP-Modal__desc">{localTask.description}</p>
                ) : (
                  <p className="CP-Modal__desc-empty">Add a description...</p>
                )}
              </div>
            </div>

            <div className="CP-Modal__section">
              <h3 className="CP-Modal__section-title">Comments</h3>
              <div className="CP-Modal__comments-wrapper">
                <div className="CP-Modal__comments-list">
                  {isLoading ? (
                    <p className="CP-Modal__comments-empty">Loading comments...</p>
                  ) : comments.length === 0 ? (
                    <p className="CP-Modal__comments-empty">No comments yet.</p>
                  ) : (
                    comments.map(c => (
                      <div key={c.id} className="CP-Modal__comment-card">
                        <div className="CP-Modal__comment-header">
                          <span className="CP-Modal__comment-author">{c.userName || "User"}</span>
                        </div>
                        <p className="CP-Modal__comment-text">{c.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={commentsEndRef} />
                </div>
              </div>

              <div className="CP-Modal__comment-input">
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a comment... (Ctrl + Enter)" 
                  className="CP-Modal__comment-textarea"
                  rows="3"
                />
                <button 
                  onClick={handlePost} 
                  disabled={isSubmitting || !newComment.trim()}
                  className="CP-Modal__comment-btn"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>

          <div className="CP-Modal__sidebar">
            <div className="CP-Modal__sidebar-panel">
              <div className="CP-Modal__field">
                <span className="CP-Modal__field-label">Status</span>
                <span className="CP-Modal__status-badge">{currentCol?.title || "—"}</span>
              </div>
              
              <div className="CP-Modal__field">
                <span className="CP-Modal__field-label">Assignee</span>
                <div className="CP-Modal__assignee-wrapper">
                  <select
                    className="CP-Modal__select-assignee"
                    value={localTask.assignedToId || ""}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.userName || m.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="CP-Modal__field">
                <span className="CP-Modal__field-label">Priority</span>
                <span className={`CP-Modal__field-value CP-Modal__pri--${localTask.priority?.toLowerCase() || 'low'}`}>
                  {localTask.priority || "Low"}
                </span>
              </div>

              <div className="CP-Modal__field">
                <span className="CP-Modal__field-label">Due Date</span>
                <span className="CP-Modal__field-value">{localTask.dueDate || "None"}</span>
              </div>
            </div>

            <div className="CP-Modal__sidebar-panel">
              <button className="CP-Modal__delete-btn" onClick={() => onDelete(localTask.id)}>
                Delete Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}