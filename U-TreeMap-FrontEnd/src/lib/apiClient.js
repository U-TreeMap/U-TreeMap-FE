// src/lib/apiClient.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  //withCredentials: true, // 쿠키 기반이면 유지
});
