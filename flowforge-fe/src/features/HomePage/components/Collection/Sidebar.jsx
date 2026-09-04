import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../features/auth/AuthProvider";


const NAV = [
  { id: "board",    label: "Board",    active: true },
  { id: "timeline", label: "Timeline" },
  { id: "backlog",  label: "Backlog" },
  { id: "notes",    label: "Notes" },
  { id: "team",     label: "Team" },
  { id: "settings", label: "Settings" },
];

export default function Sidebar({
  totalTasks = 0,
  doneTasks = 0,
  projects = [],
  activeProjectId = null,
  setActiveProjectId = () => {},
  onCreateProject = () => {}
}) {
  // console.log("Projects ở Sidebar:", projects);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const userInitials = user && user.email ? user.email.slice(0, 2).toUpperCase() : "U";
  const userName = user && user.email ? user.email.split("@")[0] : "User";
  
  
  

  return (
    <aside className={`CP-Sidebar ${collapsed ? "CP-Sidebar--collapsed" : ""}`}>
      <div className="CP-Sidebar__top">
        <Link to="/" className="CP-Sidebar__logo">
          <div className="CP-Sidebar__logo-icon">F</div>
          {!collapsed && <span className="CP-Sidebar__logo-text">FLOWFORGE</span>}
        </Link>
        <button className="CP-Sidebar__toggle" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {!collapsed && (
        <div style={{ padding: "10px 16px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Project</label>
          <div style={{ display: "flex", gap: "6px" }}>
            <select
              style={{
                flex: 1,
                background: "#222",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                color: "#fff",
                padding: "6px 10px",
                fontSize: "12px",
                fontFamily: "inherit",
                cursor: "pointer",
                outline: "none"
              }}
              value={activeProjectId || ""}
              onChange={(e) => setActiveProjectId(e.target.value)}
            >
              {projects.length === 0 ? (
                <option value="">No Projects</option>
              ) : (
                projects.map((p) => (
                  <option key={p.projectId} value={p.projectId} style={{ background: "#111", color: "#fff" }}>
                    {p.projectName}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={onCreateProject}
              style={{
                background: "#f6f5f1",
                color: "#111",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "12px"
              }}
              title="Create New Project"
            >
              +
            </button>
          </div>
        </div>
      )}

      <nav className="CP-Sidebar__nav">
        {NAV.map((item) => (
          <a key={item.id} href="#" className={`CP-Sidebar__link ${item.active ? "CP-Sidebar__link--active" : ""}`}>
            {!collapsed ? item.label : item.label[0]}
          </a>
        ))}
      </nav>

      {!collapsed && (
        <div className="CP-Sidebar__progress">
          <div className="CP-Sidebar__progress-label">
            <span>Sprint</span><span>{progress}%</span>
          </div>
          <div className="CP-Sidebar__progress-bar">
            <div className="CP-Sidebar__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="CP-Sidebar__progress-detail">{doneTasks} / {totalTasks} done</div>
        </div>
      )}

      <div className="CP-Sidebar__footer">
        <div className="CP-Sidebar__avatar">{userInitials}</div>
        {!collapsed && (
          <div className="CP-Sidebar__user">
            <div className="CP-Sidebar__user-name">{userName}</div>
            <div className="CP-Sidebar__user-role">{user?.role || "Developer"}</div>
          </div>
        )}
      </div>
    </aside>
  );
}