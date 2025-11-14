import { useEffect, useMemo, useState } from "react";
import { useApi } from "./hooks/useApi";
import type { AuthPayload, DashboardSummary, Task, TaskForm } from "./types";
import LoginPanel from "./components/LoginPanel";
import TaskBoard from "./components/TaskBoard";
import DashboardSummaryCard from "./components/DashboardSummary";
import { NORMALIZE_STATUS, STATUS_CONFIG } from "./constants/status";

const App = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("ponte:favorites");
      return stored ? (JSON.parse(stored) as number[]) : [];
    } catch {
      return [];
    }
  });
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("ponte:favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const normalizedTasks = useMemo(
    () => tasks.map((task) => ({ ...task, status: NORMALIZE_STATUS(task.status) })),
    [tasks]
  );

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return normalizedTasks
      .filter((task) => (term ? task.title.toLowerCase().includes(term) : true))
      .sort((a, b) => Number(favoriteSet.has(b.id)) - Number(favoriteSet.has(a.id)));
  }, [favoriteSet, normalizedTasks, searchTerm]);

  const statusBreakdown = useMemo(
    () =>
      STATUS_CONFIG.map((config) => ({
        label: config.label,
        color: config.color,
        value: normalizedTasks.filter((task) => task.status === config.value).length
      })),
    [normalizedTasks]
  );

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

  const toggleFavorite = (taskId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
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
            <h1 className="hero">Olá, {userName.split(" ")[0]}</h1>
            <p className="muted">Sincronize squads, elimine ruídos e avance com clareza.</p>
            <button className="ghost" onClick={() => setToken(null)}>
              Encerrar sessão
            </button>
          </header>
          <DashboardSummaryCard summary={summary} statusBreakdown={statusBreakdown} />
          <TaskBoard
            tasks={filteredTasks}
            onCreate={handleCreateTask}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onToggleFavorite={toggleFavorite}
            favorites={favoriteSet}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
          {loading && <p className="muted">Atualizando telemetria...</p>}
        </section>
      )}
    </main>
  );
};

export default App;
