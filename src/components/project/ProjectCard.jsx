import { useNavigate } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project, onEdit, onDelete, isOwner }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className={styles.header}>
        <div className={styles.icon}>
          {project.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          {isOwner && (
            <>
              <button
                className={styles.actionBtn}
                onClick={() => onEdit(project)}
                title="Edit"
              >
                ✎
              </button>
              <button
                className={`${styles.actionBtn} ${styles.danger}`}
                onClick={() => onDelete(project.id)}
                title="Delete"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>

      <h3 className={styles.name}>{project.name}</h3>
      {project.description && (
        <p className={styles.desc}>{project.description}</p>
      )}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{project.taskCount}</span>
          <span className={styles.statLabel}>Tasks</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{project.memberCount}</span>
          <span className={styles.statLabel}>Members</span>
        </div>
      </div>
    </div>
  );
}
