import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";

import { projectApi } from "../api/projectApi";

import TaskCard from "../components/task/TaskCard";
import TaskForm from "../components/task/TaskForm";
import MemberList from "../components/member/MemberList";

import Modal from "../components/common/Modal";
import Spinner from "../components/common/Spinner";

import toast from "react-hot-toast";

import styles from "./ProjectDetail.module.css";
const COLS = [
  { key: "TODO", label: "To Do", accent: "var(--text3)" },
  { key: "IN_PROGRESS", label: "In Progress", accent: "var(--amber)" },
  { key: "DONE", label: "Done", accent: "var(--green)" },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [projLoad, setProjLoad] = useState(true);
  const [tab, setTab] = useState("board"); // 'board' | 'members'
  const [modal, setModal] = useState(null); // null | 'task' | 'editTask' | 'addMember'
  const [editTask, setEditTask] = useState(null);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState("MEMBER");
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilter] = useState("ALL");

  const {
    tasks,
    loading: taskLoad,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  } = useTasks(Number(id));

  // Fetch project details
  useEffect(() => {
    projectApi
      .getById(id)
      .then((r) => setProject(r.data))
      .catch(() => {
        toast.error("Project not found");
        navigate("/projects");
      })
      .finally(() => setProjLoad(false));
  }, [id]);

  const isAdmin =
    project?.ownerId === user?.id ||
    project?.members?.some((m) => m.userId === user?.id && m.role === "ADMIN");

  const members = project?.members || [];

  // Board columns
  const getColTasks = (status) => {
    const list =
      filterStatus === "ALL"
        ? tasks
        : tasks.filter((t) => t.status === filterStatus);
    return list.filter((t) => t.status === status);
  };

  // Task actions
  const openCreate = () => {
    setEditTask(null);
    setModal("task");
  };
  const openEdit = (t) => {
    setEditTask(t);
    setModal("editTask");
  };
  const closeModal = () => {
    setModal(null);
    setEditTask(null);
  };

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      await createTask({ ...form, projectId: Number(id) });
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateTask(editTask.id, { ...form, projectId: Number(id) });
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateStatus(taskId, status);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Member actions
  const handleAddMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Find user by email via project members list — backend accepts userId
      // Here we pass email in body; backend would need to resolve, or use userId directly
      await projectApi.addMember(id, { email: addEmail, role: addRole });
      toast.success("Member added!");
      const r = await projectApi.getById(id);
      setProject(r.data);
      setAddEmail("");
      setAddRole("MEMBER");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("Remove this member?")) return;
    try {
      await projectApi.removeMember(id, userId);
      toast.success("Member removed");
      const r = await projectApi.getById(id);
      setProject(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  if (projLoad)
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
      </div>
    );

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div
          className={styles.breadcrumb}
          onClick={() => navigate("/projects")}
        >
          ← Projects
        </div>
        <div className={styles.titleRow}>
          <div className={styles.projectIcon}>{project?.name?.charAt(0)}</div>
          <div>
            <h1 className={styles.heading}>{project?.name}</h1>
            {project?.description && (
              <p className={styles.sub}>{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs + Actions */}
      <div className={styles.toolbar}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "board" ? styles.activeTab : ""}`}
            onClick={() => setTab("board")}
          >
            Board
          </button>
          <button
            className={`${styles.tab} ${tab === "members" ? styles.activeTab : ""}`}
            onClick={() => setTab("members")}
          >
            Members <span className={styles.badge}>{members.length}</span>
          </button>
        </div>

        <div className={styles.actions}>
          {tab === "board" && (
            <>
              <select
                className={styles.filter}
                value={filterStatus}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              {isAdmin && (
                <button className={styles.addBtn} onClick={openCreate}>
                  + Add Task
                </button>
              )}
            </>
          )}
          {tab === "members" && isAdmin && (
            <button
              className={styles.addBtn}
              onClick={() => setModal("addMember")}
            >
              + Add Member
            </button>
          )}
        </div>
      </div>

      {/* Board View */}
      {tab === "board" && (
        <div className={styles.board}>
          {taskLoad ? (
            <div className={styles.boardLoader}>
              <Spinner size={28} />
            </div>
          ) : (
            COLS.map((col) => {
              const colTasks = getColTasks(col.key);
              return (
                <div key={col.key} className={styles.column}>
                  <div className={styles.colHeader}>
                    <div
                      className={styles.colDot}
                      style={{ background: col.accent }}
                    />
                    <span className={styles.colLabel}>{col.label}</span>
                    <span className={styles.colCount}>{colTasks.length}</span>
                  </div>
                  <div className={styles.colBody}>
                    {colTasks.length === 0 ? (
                      <div className={styles.colEmpty}>No tasks</div>
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                          isAdmin={isAdmin}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Members View */}
      {tab === "members" && (
        <div className={styles.membersView}>
          <MemberList
            members={members}
            onRemove={handleRemoveMember}
            currentUserId={user?.id}
            isAdmin={isAdmin}
          />
        </div>
      )}

      {/* Create Task Modal */}
      <Modal open={modal === "task"} onClose={closeModal} title="New Task">
        <TaskForm
          onSubmit={handleCreate}
          projectId={Number(id)}
          members={members}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal open={modal === "editTask"} onClose={closeModal} title="Edit Task">
        {editTask && (
          <TaskForm
            onSubmit={handleUpdate}
            initialData={editTask}
            projectId={Number(id)}
            members={members}
          />
        )}
      </Modal>

      {/* Add Member Modal */}
      <Modal
        open={modal === "addMember"}
        onClose={closeModal}
        title="Add Member"
      >
        <form onSubmit={handleAddMember} className={styles.memberForm}>
          <div className={styles.field}>
            <label className={styles.label}>User Email</label>
            <input
              className={styles.input}
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="user@example.com"
              required
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.select}
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className={styles.addBtn} disabled={saving}>
            {saving ? "Adding..." : "Add Member"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
