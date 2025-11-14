import { useEffect, useMemo, useState } from "react";
import { useApi } from "./hooks/useApi";
import type { AuthPayload, DashboardSummary, Task, TaskForm } from "./types";
import LoginPanel from "./components/LoginPanel";
import TaskBoard from "./components/TaskBoard";
import DashboardSummaryCard from "./components/DashboardSummary";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const api = useApi(token);

  useEffect(() => {
    if (!token) {
      setTasks([]);
      setSummary(null);
      return;
    }
    setLoading(true);
    Promise.all([api.fetchTasks(), api.fetchSummary()])
      .then(([taskList, dashboard]) => {
        setTasks(taskList);
        setSummary(dashboard);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogin = async (payload: AuthPayload) => {
    const session = await api.login(payload);
    setToken(session.access_token);
    setUserName(session.user.full_name);
  };

  const handleRegister = async (payload: AuthPayload) => {
    const session = await api.register(payload);
    setToken(session.access_token);
    setUserName(session.user.full_name);
  };

  const handleCreateTask = async (payload: TaskForm) => {
    const formatted = {
      ...payload,
      due_date: payload.due_date ? new Date(payload.due_date).toISOString() : undefined
    };
    const task = await api.createTask(formatted);
    setTasks((prev) => [task, ...prev]);
    const refreshed = await api.fetchSummary();
    setSummary(refreshed);
  };

  const handleToggleTask = async (task: Task) => {
    const nextStatus = task.status === "done" ? "in_progress" : "done";
    const updated = await api.updateTask(task.id, { status: nextStatus });
    setTasks((prev) => prev.map((item) => (item.id === task.id ? updated : item)));
    const refreshed = await api.fetchSummary();
    setSummary(refreshed);
  };

  const handleDeleteTask = async (task: Task) => {
    await api.deleteTask(task.id);
    setTasks((prev) => prev.filter((item) => item.id !== task.id));
    const refreshed = await api.fetchSummary();
    setSummary(refreshed);
  };

  const backgroundGrid = useMemo(() => Array.from({ length: 24 }, (_, index) => <span key={index} />), []);

  return (
    <main className="layout">
      <div className="grid-overlay">{backgroundGrid}</div>
      {!token ? (
        <LoginPanel onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <section className="stack gap-lg">
          <header>
            <p className="eyebrow">Bem-vindo(a)</p>
            <h1 className="hero">Ola, {userName.split(" ")[0]}</h1>
            <p className="muted">Sincronize squads, elimine ruidos e avance com clareza.</p>
            <button className="ghost" onClick={() => setToken(null)}>
              Encerrar sessao
            </button>
          </header>
          <DashboardSummaryCard summary={summary} />
          <TaskBoard tasks={tasks} onCreate={handleCreateTask} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
          {loading && <p className="muted">Atualizando telemetria...</p>}
        </section>
      )}
    </main>
  );
};

export default App;
