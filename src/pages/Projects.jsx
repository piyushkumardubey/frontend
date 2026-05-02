import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/project/ProjectCard";
import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import styles from "./Projects.module.css";

function ProjectForm({ onSubmit, initial = {}, loading }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className={styles.form}
    >
      <div className={styles.field}>
        <label className={styles.label}>Project Name *</label>
        <input
          className={styles.input}
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Website Redesign"
          required
          autoFocus
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={form.description}
          onChange={set("description")}
          placeholder="What is this project about?"
          rows={3}
        />
      </div>
      <button type="submit" className={styles.btn} disabled={loading}>
        {loading
          ? "Saving..."
          : initial.id
            ? "Update Project"
            : "Create Project"}
      </button>
    </form>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const { projects, loading, createProject, updateProject, deleteProject } =
    useProjects();
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setModal("create");
  };
  const openEdit = (p) => {
    setEditing(p);
    setModal("edit");
  };
  const closeModal = () => {
    setModal(null);
    setEditing(null);
  };

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createProject(form);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateProject(editing.id, form);
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    try {
      await deleteProject(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  if (loading)
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.sub}>
            {projects.length} project{projects.length !== 1 ? "s" : ""} you're
            part of
          </p>
        </div>
        <button className={styles.createBtn} onClick={openCreate}>
          + New Project
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◫</div>
          <h2 className={styles.emptyTitle}>No projects yet</h2>
          <p className={styles.emptySub}>
            Create your first project to get started
          </p>
          <button className={styles.createBtn} onClick={openCreate}>
            + Create Project
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <ProjectCard
                project={p}
                onEdit={openEdit}
                onDelete={handleDelete}
                isOwner={p.ownerId === user?.id}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={modal === "create"} onClose={closeModal} title="New Project">
        <ProjectForm onSubmit={handleCreate} loading={saving} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={modal === "edit"} onClose={closeModal} title="Edit Project">
        <ProjectForm
          onSubmit={handleUpdate}
          initial={editing || {}}
          loading={saving}
        />
      </Modal>
    </div>
  );
}
