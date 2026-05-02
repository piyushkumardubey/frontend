import { format } from "date-fns";

import StatusBadge from "../common/StatusBadge";

import styles from "./TaskCard.module.css";

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];

export default function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isAdmin,
}) {
  return (
    <div className={`${styles.card} ${task.overdue ? styles.overdue : ""}`}>
      {task.overdue && <div className={styles.overdueBanner}>Overdue</div>}

      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.actions}>
          {isAdmin && (
            <>
              <button
                className={styles.actionBtn}
                onClick={() => onEdit(task)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className={`${styles.actionBtn} ${styles.danger}`}
                onClick={() => onDelete(task.id)}
                title="Delete"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      {task.description && <p className={styles.desc}>{task.description}</p>}

      <div className={styles.meta}>
        {task.assigneeName && (
          <div className={styles.assignee}>
            <span className={styles.avatar}>{task.assigneeName.charAt(0)}</span>
            <span>{task.assigneeName}</span>
          </div>
        )}
        {task.dueDate && (
          <span
            className={`${styles.due} ${task.overdue ? styles.dueOverdue : ""}`}
          >
            📅 {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <StatusBadge status={task.status} />
        <select
          className={styles.statusSelect}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
