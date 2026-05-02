import StatusBadge from "../common/StatusBadge";

import styles from "./MemberList.module.css";
export default function MemberList({
  members,
  onRemove,
  currentUserId,
  isAdmin,
}) {
  return (
    <div className={styles.list}>
      {members.map((m) => (
        <div key={m.userId} className={styles.item}>
          <div className={styles.avatar}>
            {m.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className={styles.info}>
            <span className={styles.name}>{m.name}</span>
            <span className={styles.email}>{m.email}</span>
          </div>
          <StatusBadge status={m.role} />
          {isAdmin && m.userId !== currentUserId && (
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(m.userId)}
              title="Remove member"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
