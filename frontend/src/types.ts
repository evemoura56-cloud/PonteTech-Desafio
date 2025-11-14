export type AuthPayload = {
  email: string;
  password: string;
  full_name?: string;
};

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
};

export type StatusValue = "backlog" | "in_progress" | "done";

export type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: StatusValue;
  priority: string;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskForm = {
  title: string;
  description?: string;
  status: StatusValue;
  priority: string;
  due_date?: string;
};

export type DashboardSummary = {
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  upcoming_tasks: number;
  active_projects: number;
};
