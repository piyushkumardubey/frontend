import { useState, useEffect, useCallback } from "react";
import { projectApi } from "../api/projectApi";
import toast from "react-hot-toast";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await projectApi.getAll();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (formData) => {
    const { data } = await projectApi.create(formData);
    setProjects((prev) => [data, ...prev]);
    toast.success("Project created!");
    return data;
  };

  const updateProject = async (id, formData) => {
    const { data } = await projectApi.update(id, formData);
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    toast.success("Project updated!");
    return data;
  };

  const deleteProject = async (id) => {
    await projectApi.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  const addMember = async (projectId, userId, role = "MEMBER") => {
    await projectApi.addMember(projectId, { userId, role });
    toast.success("Member added!");
    await fetchProjects();
  };

  const removeMember = async (projectId, userId) => {
    await projectApi.removeMember(projectId, userId);
    toast.success("Member removed");
    await fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
  };
}
