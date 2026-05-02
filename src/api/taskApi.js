import api from "./axios";

export const taskApi = {
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getMyTasks: () => api.get("/tasks/my"),
  getOverdue: () => api.get("/tasks/overdue"),
  create: (data) => api.post("/tasks", data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) =>
    api.patch(`/tasks/${id}/status?status=${status}`),
  delete: (id) => api.delete(`/tasks/${id}`),
  getStats: () => api.get("/dashboard/stats"),
};
