import api from "./api.js";

export const counterService = {
  increment: async (word) => {
    const response = await api.post("/counters/increment", { word });
    return response.data;
  },
  getAll: async () => {
    const response = await api.get("/counters");
    return response.data;
  },
  getOne: async (word) => {
    const response = await api.get(`/counters/${word}`);
    return response.data;
  },
  reset: async (word) => {
    const response = await api.put(`/counters/reset/${word}`);
    return response.data;
  },
};
