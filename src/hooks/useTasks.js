import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../api/taskApi";
import toast from "react-hot-toast";

export function useTasks(projectId = null) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = projectId
        ? await taskApi.getByProject(projectId)
        : await taskApi.getMyTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (formData) => {
    const { data } = await taskApi.create(formData);
    setTasks((prev) => [data, ...prev]);
    toast.success("Task created!");
    return data;
  };

  const updateTask = async (id, formData) => {
    const { data } = await taskApi.update(id, formData);
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    toast.success("Task updated!");
    return data;
  };

  const updateStatus = async (id, status) => {
    const { data } = await taskApi.updateStatus(id, status);
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    toast.success("Status updated!");
    return data;
  };

  const deleteTask = async (id) => {
    await taskApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task deleted");
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  };
}
