import { useState } from "react";
import styles from "./TaskForm.module.css";

export default function TaskForm({
  onSubmit,
  initialData = {},
  projectId,
  members = [],
}) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    status: initialData.status || "TODO",
    dueDate: initialData.dueDate || "",
    assigneeId: initialData.assigneeId || "",
    projectId: projectId,
  });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
        projectId: Number(form.projectId),
        dueDate: form.dueDate || null,
      };
      await onSubmit(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Title *</label>
        <input
          className={styles.input}
          value={form.title}
          onChange={set("title")}
          placeholder="What needs to be done?"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={set("description")}
          placeholder="Add more details..."
          rows={3}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.select}
            value={form.status}
            onChange={set("status")}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={styles.input}
            value={form.dueDate}
            onChange={set("dueDate")}
          />
        </div>
      </div>

      {members.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>Assign To</label>
          <select
            className={styles.select}
            value={form.assigneeId}
            onChange={set("assigneeId")}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" className={styles.btn} disabled={loading}>
        {loading ? "Saving..." : initialData.id ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
