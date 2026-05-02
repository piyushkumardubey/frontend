import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/projects", label: "Projects", icon: "◫" },
  { to: "/my-tasks", label: "My Tasks", icon: "✦" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoMark}>PF</span>
        <span className={styles.logoText}>ProjectFlow</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${styles.navItem} ${location.pathname.startsWith(item.to) ? styles.active : ""}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userRole}>{isAdmin ? "Admin" : "Member"}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
