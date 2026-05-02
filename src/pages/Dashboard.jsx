import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { taskApi } from "../api/taskApi";
import { projectApi } from "../api/projectApi";

import { format } from "date-fns";

import StatusBadge from "../components/common/StatusBadge";
import Spinner from "../components/common/Spinner";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([taskApi.getStats(), taskApi.getOverdue(), projectApi.getAll()])
      .then(([s, o, p]) => {
        setStats(s.data);
        setOverdue(o.data);
        setProjects(p.data.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className={styles.loader}>
        <Spinner size={36} />
      </div>
    );

  const statCards = [
    { label: "To Do", key: "TODO", color: styles.cardTodo, icon: "○" },
    {
      label: "In Progress",
      key: "IN_PROGRESS",
      color: styles.cardProgress,
      icon: "◑",
    },
    { label: "Done", key: "DONE", color: styles.cardDone, icon: "●" },
    { label: "Overdue", key: "OVERDUE", color: styles.cardOverdue, icon: "⚠" },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>
            Good {getGreeting()},{" "}
            <span className={styles.name}>{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className={styles.sub}>
            Here's what's happening across your projects
          </p>
        </div>
        <div className={styles.date}>{format(new Date(), "EEEE, MMM d")}</div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.key} className={`${styles.statCard} ${card.color}`}>
            <div className={styles.statIcon}>{card.icon}</div>
            <div className={styles.statNum}>{stats?.[card.key] ?? 0}</div>
            <div className={styles.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Overdue Tasks */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <span
                className={styles.dot}
                style={{ background: "var(--red)" }}
              />
              Overdue Tasks
            </h2>
            <Link to="/my-tasks" className={styles.seeAll}>
              See all →
            </Link>
          </div>

          {overdue.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✓</span>
              <p>No overdue tasks — great work!</p>
            </div>
          ) : (
            <div className={styles.overdueList}>
              {overdue.map((task) => (
                <div key={task.id} className={styles.overdueItem}>
                  <div className={styles.overdueInfo}>
                    <p className={styles.overdueTitle}>{task.title}</p>
                    <p className={styles.overdueMeta}>
                      {task.projectName} · Due{" "}
                      {format(new Date(task.dueDate), "MMM d")}
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Projects */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>
              <span
                className={styles.dot}
                style={{ background: "var(--accent)" }}
              />
              Recent Projects
            </h2>
            <Link to="/projects" className={styles.seeAll}>
              See all →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>◫</span>
              <p>
                No projects yet.{" "}
                <Link to="/projects" className={styles.link}>
                  Create one!
                </Link>
              </p>
            </div>
          ) : (
            <div className={styles.projectList}>
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className={styles.projectItem}
                >
                  <div className={styles.projectIcon}>{p.name.charAt(0)}</div>
                  <div className={styles.projectInfo}>
                    <p className={styles.projectName}>{p.name}</p>
                    <p className={styles.projectMeta}>
                      {p.taskCount} tasks · {p.memberCount} members
                    </p>
                  </div>
                  <span className={styles.chevron}>›</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
