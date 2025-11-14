import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import type { AuthPayload, AuthResponse, Task, TaskForm, DashboardSummary } from "../types";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const useApi = (token: string | null) => {
  const authenticatedClient = useMemo<AxiosInstance>(() => {
    return axios.create({
      baseURL,
      timeout: 8000,
      headers: token
        ? {
            Authorization: `Bearer ${token}`
          }
        : undefined
    });
  }, [token]);

  const publicClient = useMemo<AxiosInstance>(() => {
    return axios.create({
      baseURL,
      timeout: 8000
    });
  }, []);

  const login = async (payload: AuthPayload): Promise<AuthResponse> => {
    const { data } = await publicClient.post<AuthResponse>("/auth/login", payload);
    return data;
  };

  const register = async (payload: AuthPayload): Promise<AuthResponse> => {
    await publicClient.post("/auth/register", payload);
    return login({ email: payload.email, password: payload.password });
  };

  const fetchTasks = async (): Promise<Task[]> => {
    const { data } = await authenticatedClient.get<Task[]>("/tasks/");
    return data;
  };

  const createTask = async (payload: TaskForm): Promise<Task> => {
    const { data } = await authenticatedClient.post<Task>("/tasks/", payload);
    return data;
  };

  const updateTask = async (id: number, payload: Partial<TaskForm>): Promise<Task> => {
    const { data } = await authenticatedClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  };

  const deleteTask = async (id: number): Promise<void> => {
    await authenticatedClient.delete(`/tasks/${id}`);
  };

  const fetchSummary = async (): Promise<DashboardSummary> => {
    const { data } = await authenticatedClient.get<DashboardSummary>("/dashboard/summary");
    return data;
  };

  return {
    login,
    register,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchSummary
  };
};
