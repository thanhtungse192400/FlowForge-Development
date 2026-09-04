import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import Sidebar from "./Sidebar";
import BoardColumn from "./components/BoardColumn";
import TaskModal from "./components/TaskModal";
import CreateTaskModal from "./components/CreateTaskModal";
import TaskCardDragOverlay from "./components/TaskCardDragOverlay";
import CalendarPanel from "./components/CalendarPanel";
import OverduePanel from "./components/OverduePanel";
import MembersPanel from "./components/MembersPanel";

import { useProjects } from "../../../Project/hooks/useProjects";
import { useTasks } from "../../../Task/hooks/useTasks";

import "./CollectionPage.css";

// ── Map Backend TaskStatus enum to column definitions ──
const COLUMN_DEFS = [
  { id: "todo",        title: "To Do",        accent: "#6366f1", beStatus: "TODO" },
  { id: "in-progress", title: "In Progress",  accent: "#f59e0b", beStatus: "IN_PROGRESS" },
  { id: "review",      title: "In Review",    accent: "#8b5cf6", beStatus: "REVIEW" },
  { id: "done",        title: "Done",         accent: "#10b981", beStatus: "DONE" },
];

const STATUS_TO_COL = {};
COLUMN_DEFS.forEach((c) => { STATUS_TO_COL[c.beStatus] = c.id; });

const COL_TO_STATUS = {};
COLUMN_DEFS.forEach((c) => { COL_TO_STATUS[c.id] = c.beStatus; });

// ── Helper: map a BE task object to a FE card object ──
function mapBeTaskToCard(t) {
  return {
    id: t.taskId,
    title: t.title || "Untitled",
    description: t.description || "",
    priority: "medium",
    labels: [],
    assignee: t.assignedToId ? t.assignedToId.slice(0, 2).toUpperCase() : null,
    assignedToId: t.assignedToId || null,
    dueDate: null,
    subtasks: { done: 0, total: 0 },
    createdAt: null,
    status: t.status,
    projectId: t.projectId,
    createdById: t.createdById,
  };
}

export default function CollectionPage() {
  // ── Project state ──
  const { projects, isLoading: projectsLoading, createProject } = useProjects();
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  // Auto-select first project when projects load
  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      const first = projects[0];
      setActiveProjectId(first.projectId);
    }
  }, [projects, activeProjectId]);

  // ── Task state from API ──
  const {
    tasks: apiTasks,
    isLoading: tasksLoading,
    createTask: apiCreateTask,
    updateTask: apiUpdateTask,
    deleteTask: apiDeleteTask,
  } = useTasks(activeProjectId);

  // ── Build columns from API tasks ──
  const columns = useMemo(() => {
    return COLUMN_DEFS.map((def) => ({
      ...def,
      tasks: apiTasks
        .filter((t) => STATUS_TO_COL[t.status] === def.id)
        .map(mapBeTaskToCard),
    }));
  }, [apiTasks]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTask, setActiveTask] = useState(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Find which column a task belongs to
  const findColumn = useCallback(
    (taskId) => columns.find((col) => col.tasks.some((t) => t.id === taskId)),
    [columns]
  );

  // ── DnD handlers ──
  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      const col = findColumn(active.id);
      const task = col?.tasks.find((t) => t.id === active.id);
      setActiveTask(task || null);
    },
    [findColumn]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const sourceCol = findColumn(active.id);
      if (!sourceCol) return;

      let targetColId = over.id;
      const targetCol = columns.find((c) => c.id === over.id);
      if (!targetCol) {
        const col = findColumn(over.id);
        if (col) targetColId = col.id;
        else return;
      }

      if (sourceCol.id === targetColId) return;

      const movedTask = sourceCol.tasks.find((t) => t.id === active.id);
      if (!movedTask) return;

      // Call API to update status
      const newStatus = COL_TO_STATUS[targetColId];
      try {
        await apiUpdateTask({
          taskId: movedTask.id,
          data: {
            title: movedTask.title,
            description: movedTask.description,
            status: newStatus,
            projectId: activeProjectId,
            assignedToId: movedTask.assignedToId || null,
          },
        });
      } catch (err) {
        console.error("Failed to move task:", err);
      }
    },
    [columns, findColumn, apiUpdateTask, activeProjectId]
  );

  // ── Task actions ──
  const handleTaskClick = useCallback((task) => setSelectedTask(task), []);

  const handleCreateTask = useCallback(
    async (newTask) => {
      try {
        await apiCreateTask({
          title: newTask.title,
          description: newTask.description,
          status: "TODO",
          projectId: activeProjectId,
          assignedToId: newTask.assignedToId || null,
        });
        setShowCreateModal(false);
      } catch (err) {
        console.error("Failed to create task:", err);
        alert("Failed to create task: " + (err?.response?.data?.message || err.message));
      }
    },
    [apiCreateTask, activeProjectId]
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      try {
        await apiDeleteTask(taskId);
        setSelectedTask(null);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    },
    [apiDeleteTask]
  );

  const handleMoveTask = useCallback(
    async (taskId, targetColumnId) => {
      const allColTasks = columns.flatMap((c) => c.tasks);
      const task = allColTasks.find((t) => t.id === taskId);
      if (!task) return;

      const newStatus = COL_TO_STATUS[targetColumnId];
      try {
        await apiUpdateTask({
          taskId,
          data: {
            title: task.title,
            description: task.description,
            status: newStatus,
            projectId: activeProjectId,
            assignedToId: task.assignedToId || null,
          },
        });
        setSelectedTask(null);
      } catch (err) {
        console.error("Failed to move task:", err);
      }
    },
    [columns, apiUpdateTask, activeProjectId]
  );

  // ── Create project handler ──
  const handleCreateProject = useCallback(async () => {
    if (!newProjectName.trim()) return;
    try {
      const result = await createProject({ name: newProjectName.trim(), description: newProjectDesc.trim() });
      // Auto-select new project
      if (result?.data?.projectId) {
        setActiveProjectId(result.data.projectId);
      }
      setShowCreateProjectModal(false);
      setNewProjectName("");
      setNewProjectDesc("");
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project: " + (err?.response?.data?.message || err.message));
    }
  }, [createProject, newProjectName, newProjectDesc]);

  // ── Filtering ──
  const filteredColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => {
          const matchSearch =
            !searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.id && task.id.toString().toLowerCase().includes(searchQuery.toLowerCase()));
          const matchPri =
            filterPriority === "all" || task.priority === filterPriority;
          return matchSearch && matchPri;
        }),
      })),
    [columns, searchQuery, filterPriority]
  );

  // ── All tasks flat for calendar/overdue ──
  const allTasks = useMemo(
    () => columns.flatMap((col) => col.tasks.map((t) => ({ ...t, status: col.id }))),
    [columns]
  );

  // Stats
  const totalTasks = columns.reduce((s, c) => s + c.tasks.length, 0);
  const doneTasks = columns.find((c) => c.id === "done")?.tasks.length || 0;

  // Active project name for breadcrumb
  const activeProject = projects.find((p) => p.projectId === activeProjectId);
  const activeProjectName = activeProject?.projectName || "FlowForge";

  // Loading state
  if (projectsLoading) {
    return (
      <div className="CP" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "rgba(0,0,0,0.4)" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px", animation: "pulse 1.5s ease infinite" }}>⟳</div>
          <div style={{ fontSize: "13px" }}>Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="CP">
      <Sidebar
        totalTasks={totalTasks}
        doneTasks={doneTasks}
        projects={projects}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
        onCreateProject={() => setShowCreateProjectModal(true)}
      />

      <main className="CP-Main">
        {/* Header */}
        <header className="CP-Header">
          <div className="CP-Header__left">
            <Link to="/" className="CP-Header__back" title="Back to Home">
              ←
            </Link>
            <div className="CP-Header__breadcrumb">
              <span className="CP-Header__project">{activeProjectName}</span>
              <span className="CP-Header__sep">/</span>
              <h1 className="CP-Header__title">Project Board</h1>
            </div>
          </div>
          <div className="CP-Header__right">
            <div className="CP-Search">
              <input
                className="CP-Search__input"
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="CP-Filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button
              className="CP-CreateBtn"
              onClick={() => setShowCreateModal(true)}
              disabled={!activeProjectId}
            >
              + New Task
            </button>
          </div>
        </header>

        {/* Board + Calendar Column */}
        <div className="CP-Content">
          {tasksLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "rgba(0,0,0,0.3)", fontSize: "13px" }}>
                <div style={{ fontSize: "20px", marginBottom: "6px", animation: "pulse 1.5s ease infinite" }}>⟳</div>
                Loading tasks...
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <section className="CP-Board">
                {filteredColumns.map((col) => (
                  <BoardColumn
                    key={col.id}
                    column={col}
                    onTaskClick={handleTaskClick}
                  />
                ))}
              </section>

              <DragOverlay>
                {activeTask ? <TaskCardDragOverlay task={activeTask} /> : null}
              </DragOverlay>
            </DndContext>
          )}

          {/* Right Panel: Calendar + Members + Overdue */}
          <aside className="CP-RightPanel">
            <CalendarPanel tasks={allTasks} />
            {activeProjectId && <MembersPanel projectId={activeProjectId} />}
            <OverduePanel tasks={allTasks} onTaskClick={handleTaskClick} />
          </aside>
        </div>
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          columns={columns}
          onClose={() => setSelectedTask(null)}
          onDelete={handleDeleteTask}
          onMove={handleMoveTask}
        />
      )}
      {showCreateModal && (
        <CreateTaskModal
          projectId={activeProjectId}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {/* Create Project Modal */}
      {showCreateProjectModal && (
        <div className="CP-Modal__overlay" onClick={() => setShowCreateProjectModal(false)}>
          <div className="CP-Modal" onClick={(e) => e.stopPropagation()}>
            <div className="CP-Modal__header">
              <span className="CP-Modal__id">New Project</span>
              <button className="CP-Modal__close" onClick={() => setShowCreateProjectModal(false)}>✕</button>
            </div>
            <form
              className="CP-CreateForm"
              onSubmit={(e) => { e.preventDefault(); handleCreateProject(); }}
            >
              <div className="CP-CreateForm__group">
                <label className="CP-CreateForm__label">Project Name *</label>
                <input
                  className="CP-CreateForm__input"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  autoFocus
                />
              </div>
              <div className="CP-CreateForm__group">
                <label className="CP-CreateForm__label">Description</label>
                <textarea
                  className="CP-CreateForm__textarea"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Project description..."
                  rows={3}
                />
              </div>
              <div className="CP-CreateForm__actions">
                <button type="button" className="CP-CreateForm__cancel" onClick={() => setShowCreateProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="CP-CreateForm__submit" disabled={!newProjectName.trim()}>
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}