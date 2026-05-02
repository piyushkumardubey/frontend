import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import styles from "./Auth.module.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.role);
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>PF</div>
          <span className={styles.logoText}>ProjectFlow</span>
        </div>

        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Start managing your projects today</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              value={form.name}
              onChange={set("name")}
              placeholder="Name"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@gmail.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="Min 6 characters"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role</label>
            <select
              className={styles.select}
              value={form.role}
              onChange={set("role")}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.foot}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
