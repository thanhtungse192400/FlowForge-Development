import React, { useState } from "react";
import { Link } from "react-router-dom";

const NAV = [
  { id: "board",    label: "Board",    active: true },
  { id: "timeline", label: "Timeline" },
  { id: "backlog",  label: "Backlog" },
  { id: "notes",    label: "Notes" },
  { id: "team",     label: "Team" },
  { id: "settings", label: "Settings" },
];

export default function Sidebar({ totalTasks = 0, doneTasks = 0 }) {
  const [collapsed, setCollapsed] = useState(false);
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

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
        <div className="CP-Sidebar__avatar">TT</div>
        {!collapsed && (
          <div className="CP-Sidebar__user">
            <div className="CP-Sidebar__user-name">Thanh Tung</div>
            <div className="CP-Sidebar__user-role">Developer</div>
          </div>
        )}
      </div>
    </aside>
  );
}