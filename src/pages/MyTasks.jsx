import { useState } from "react";

import { useTasks } from "../hooks/useTasks";

import TaskCard from "../components/task/TaskCard";

import Spinner from "../components/common/Spinner";

import styles from "./MyTasks.module.css";

export default function MyTasks() {
  const { tasks, loading, updateStatus, deleteTask } = useTasks();
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = tasks.filter((t) => {
    const matchStatus = filter === "ALL" || t.status === filter;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
    } catch {
      /* toast handled in hook */
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
    } catch {
      /* toast handled in hook */
    }
  };

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
    OVERDUE: tasks.filter((t) => t.overdue).length,
  };

  if (loading)
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
      </div>
    );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>My Tasks</h1>
          <p className={styles.sub}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} assigned to you
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filters}>
          {[
            { key: "ALL", label: "All" },
            { key: "TODO", label: "To Do" },
            { key: "IN_PROGRESS", label: "In Progress" },
            { key: "DONE", label: "Done" },
            { key: "OVERDUE", label: "Overdue" },
          ].map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ""} ${f.key === "OVERDUE" ? styles.filterOverdue : ""}`}
              onClick={() => setFilter(f.key === filter ? "ALL" : f.key)}
            >
              {f.label}
              <span className={styles.filterCount}>{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <input
          className={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
        />
      </div>

      {/* Task Grid */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✦</span>
          <p>
            {search
              ? "No tasks match your search"
              : "No tasks in this category"}
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((task, i) => (
            <div key={task.id} style={{ animationDelay: `${i * 0.04}s` }}>
              <TaskCard
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={() => {}}
                onDelete={handleDelete}
                isAdmin={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
