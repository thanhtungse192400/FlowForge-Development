// ── Initial seed data for Kanban board ──
// Each task mirrors a simplified Jira issue model

export const initialBoardData = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      accent: "#6366f1",       // indigo
      tasks: [
        {
          id: "FLOW-101",
          title: "Setup JWT authentication",
          description: "Implement access & refresh token flow with Spring Security.",
          priority: "high",
          labels: ["backend", "security"],
          assignee: "TT",
          dueDate: "May 18",
          subtasks: { done: 1, total: 4 },
          createdAt: "2026-05-10",
        },
        {
          id: "FLOW-102",
          title: "Design database schema",
          description: "ERD for users, projects, tasks, comments tables.",
          priority: "medium",
          labels: ["database"],
          assignee: "HN",
          dueDate: "May 20",
          subtasks: { done: 0, total: 3 },
          createdAt: "2026-05-11",
        },
        {
          id: "FLOW-103",
          title: "Create base project structure",
          description: "Scaffold monorepo with shared utils and config.",
          priority: "low",
          labels: ["devops"],
          assignee: null,
          dueDate: null,
          subtasks: { done: 0, total: 0 },
          createdAt: "2026-05-12",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      accent: "#f59e0b",       // amber
      tasks: [
        {
          id: "FLOW-104",
          title: "Build WebSocket gateway",
          description: "Real-time event bus for task updates and notifications.",
          priority: "high",
          labels: ["backend", "realtime"],
          assignee: "TT",
          dueDate: "May 15",
          subtasks: { done: 2, total: 5 },
          createdAt: "2026-05-08",
        },
        {
          id: "FLOW-105",
          title: "Implement session device tracking",
          description: "Track active sessions per user for multi-device support.",
          priority: "high",
          labels: ["backend"],
          assignee: "HN",
          dueDate: "May 16",
          subtasks: { done: 3, total: 6 },
          createdAt: "2026-05-09",
        },
      ],
    },
    {
      id: "review",
      title: "In Review",
      accent: "#8b5cf6",       // violet
      tasks: [
        {
          id: "FLOW-106",
          title: "Code review: Auth middleware",
          description: "Review PR #42 – JWT guard and role-based access.",
          priority: "medium",
          labels: ["review"],
          assignee: "TT",
          dueDate: "May 14",
          subtasks: { done: 1, total: 2 },
          createdAt: "2026-05-12",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      accent: "#10b981",       // emerald
      tasks: [
        {
          id: "FLOW-107",
          title: "Init Spring Boot project",
          description: "Maven multi-module setup with dev profile.",
          priority: "done",
          labels: ["backend"],
          assignee: "TT",
          dueDate: null,
          subtasks: { done: 2, total: 2 },
          createdAt: "2026-05-05",
        },
        {
          id: "FLOW-108",
          title: "Setup React routing",
          description: "React Router v7 with lazy-loaded route modules.",
          priority: "done",
          labels: ["frontend"],
          assignee: "HN",
          dueDate: null,
          subtasks: { done: 3, total: 3 },
          createdAt: "2026-05-06",
        },
      ],
    },
  ],
};

// ── Label colour map ──
export const labelColors = {
  backend:  { bg: "rgba(99,102,241,0.12)", text: "#6366f1" },
  frontend: { bg: "rgba(236,72,153,0.12)", text: "#ec4899" },
  security: { bg: "rgba(239,68,68,0.12)",  text: "#ef4444" },
  database: { bg: "rgba(14,165,233,0.12)", text: "#0ea5e9" },
  devops:   { bg: "rgba(16,185,129,0.12)", text: "#10b981" },
  realtime: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
  review:   { bg: "rgba(139,92,246,0.12)", text: "#8b5cf6" },
};