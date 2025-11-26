import axios from "axios";

const API_BASE_URL = "https://copilot-dbln.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const reviewCode = async (file, language = "") => {
  const formData = new FormData();
  formData.append("file", file);
  if (language) {
    formData.append("language", language);
  }

  const response = await api.post("/review", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getReport = async (reportId) => {
  const response = await api.get(`/report/${reportId}`);
  return response.data;
};

export const getAllReports = async (page = 1, perPage = 20) => {
  const response = await api.get("/reports", {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await api.delete(`/report/${reportId}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
