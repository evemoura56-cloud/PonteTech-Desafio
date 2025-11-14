import { FormEvent, useMemo, useState } from "react";
import type { StatusValue, Task, TaskForm } from "../types";
import { STATUS_CONFIG, STATUS_LABEL_BY_VALUE } from "../constants/status";

type Props = {
  tasks: Task[];
  onCreate: (payload: TaskForm) => Promise<void>;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
  onToggleFavorite: (taskId: number) => void;
  favorites: Set<number>;
  searchTerm: string;
  onSearch: (value: string) => void;
};

const defaultForm: TaskForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "backlog",
  due_date: ""
};

export const TaskBoard = ({
  tasks,
  onCreate,
  onToggle,
  onDelete,
  onToggleFavorite,
  favorites,
  searchTerm,
  onSearch
}: Props) => {
  const [form, setForm] = useState<TaskForm>(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await onCreate(form);
    setForm(defaultForm);
    setLoading(false);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "Sem prazo";
    return new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const emptyState = !tasks.length;

  const groupedTasks = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const key = favorites.has(task.id) ? "favorites" : "regular";
        acc[key].push(task);
        return acc;
      },
      { favorites: [] as Task[], regular: [] as Task[] }
    );
  }, [favorites, tasks]);

  const renderTaskCard = (task: Task) => {
    const isFavorite = favorites.has(task.id);
    const statusLabel = STATUS_LABEL_BY_VALUE[task.status];
    return (
      <article key={task.id} className={`task-card status-${task.status}`}>
        <header>
          <div>
            <p className="eyebrow">{task.priority.toUpperCase()}</p>
            <h3>{task.title}</h3>
          </div>
          <div className="task-card-actions">
            <button className={`favorite ${isFavorite ? "active" : ""}`} onClick={() => onToggleFavorite(task.id)} type="button">
              ★
            </button>
            <button className="ghost sm" onClick={() => onDelete(task)}>
              remover
            </button>
          </div>
        </header>
        {task.description && <p className="muted">{task.description}</p>}
        <div className="task-meta">
          <span className="status-badge">{statusLabel}</span>
          <small>{formatDate(task.due_date)}</small>
        </div>
        <footer>
          <button className="ghost sm" onClick={() => onToggle(task)}>
            {task.status === "done" ? "Reabrir" : "Concluir"}
          </button>
        </footer>
      </article>
    );
  };

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <p className="eyebrow">Fluxo operacional</p>
          <h2>Painel de tarefas</h2>
          <p className="muted">Capture ideias, organize prioridades e avance sem ruídos.</p>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            placeholder="Título da tarefa"
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <input
            placeholder="Descrição"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <input
            type="date"
            value={form.due_date || ""}
            onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
          />
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as StatusValue }))}
          >
            {STATUS_CONFIG.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Gravando..." : "Adicionar"}
          </button>
        </form>
        <div className="task-search">
          <input
            placeholder="Buscar por título"
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
      </header>
      <div className="task-grid">
        {groupedTasks.favorites.map(renderTaskCard)}
        {groupedTasks.regular.map(renderTaskCard)}
        {emptyState && <p className="muted">Nenhuma tarefa registrada. Comece adicionando algo importante.</p>}
      </div>
    </section>
  );
};

export default TaskBoard;
