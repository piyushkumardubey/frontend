import styles from "./StatusBadge.module.css";

const CONFIG = {
  TODO: { label: "To Do", cls: styles.todo },
  IN_PROGRESS: { label: "In Progress", cls: styles.inProgress },
  DONE: { label: "Done", cls: styles.done },
  ADMIN: { label: "Admin", cls: styles.admin },
  MEMBER: { label: "Member", cls: styles.member },
};

export default function StatusBadge({ status }) {
  const cfg = CONFIG[status] || { label: status, cls: styles.todo };
  return <span className={`${styles.badge} ${cfg.cls}`}>{cfg.label}</span>;
}
