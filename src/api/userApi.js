import api from "./axios";

export const userApi = {
  getByEmail: (email) =>
    api.get(`/users/by-email?email=${encodeURIComponent(email)}`),
  getAll: () => api.get("/users"),
};
