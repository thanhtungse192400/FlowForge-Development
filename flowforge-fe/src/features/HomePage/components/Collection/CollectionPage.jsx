import React, { useState, useCallback, useMemo } from "react";
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

import { initialBoardData } from "./collection.data";
import "./CollectionPage.css";

export default function CollectionPage() {
  const [columns, setColumns] = useState(initialBoardData.columns);
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
    (event) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const sourceCol = findColumn(active.id);
      if (!sourceCol) return;

      // over.id could be a column id or a task id
      let targetColId = over.id;
      const targetCol = columns.find((c) => c.id === over.id);
      if (!targetCol) {
        // dropped on a task — find its column
        const col = findColumn(over.id);
        if (col) targetColId = col.id;
        else return;
      }

      if (sourceCol.id === targetColId) return;

      const movedTask = sourceCol.tasks.find((t) => t.id === active.id);
      if (!movedTask) return;

      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) };
          }
          if (col.id === targetColId) {
            return { ...col, tasks: [...col.tasks, movedTask] };
          }
          return col;
        })
      );
    },
    [columns, findColumn]
  );

  // ── Task actions ──
  const handleTaskClick = useCallback((task) => setSelectedTask(task), []);

  const handleCreateTask = useCallback((newTask) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === "todo" ? { ...col, tasks: [newTask, ...col.tasks] } : col
      )
    );
    setShowCreateModal(false);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }))
    );
    setSelectedTask(null);
  }, []);

  const handleMoveTask = useCallback((taskId, targetColumnId) => {
    let movedTask = null;
    setColumns((prev) => {
      const without = prev.map((col) => {
        const found = col.tasks.find((t) => t.id === taskId);
        if (found) movedTask = found;
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      });
      if (!movedTask) return prev;
      return without.map((col) =>
        col.id === targetColumnId
          ? { ...col, tasks: [...col.tasks, movedTask] }
          : col
      );
    });
    setSelectedTask(null);
  }, []);

  // ── Filtering ──
  const filteredColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => {
          const matchSearch =
            !searchQuery ||
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.id.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <div className="CP">
      <Sidebar totalTasks={totalTasks} doneTasks={doneTasks} />

      <main className="CP-Main">
        {/* Header */}
        <header className="CP-Header">
          <div className="CP-Header__left">
            <Link to="/" className="CP-Header__back" title="Back to Home">
              ←
            </Link>
            <div className="CP-Header__breadcrumb">
              <span className="CP-Header__project">FlowForge</span>
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
            <button className="CP-CreateBtn" onClick={() => setShowCreateModal(true)}>
              + New Task
            </button>
          </div>
        </header>

        {/* Board + Calendar Column */}
        <div className="CP-Content">
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

          {/* Right Panel: Calendar + Overdue */}
          <aside className="CP-RightPanel">
            <CalendarPanel tasks={allTasks} />
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
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}