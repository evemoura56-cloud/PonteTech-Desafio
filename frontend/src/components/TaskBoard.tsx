import { FormEvent, useState } from "react";
import type { Task, TaskForm } from "../types";

type Props = {
  tasks: Task[];
  onCreate: (payload: TaskForm) => Promise<void>;
  onToggle: (task: Task) => Promise<void>;
  onDelete: (task: Task) => Promise<void>;
};

const defaultForm: TaskForm = {
  title: "",
  description: "",
  priority: "medium",
  status: "backlog",
  due_date: ""
};

export const TaskBoard = ({ tasks, onCreate, onToggle, onDelete }: Props) => {
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

  return (
    <section className="card">
      <header className="card-header">
        <div>
          <p className="eyebrow">Fluxo operacional</p>
          <h2>Backlog inteligente</h2>
        </div>
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            placeholder="Título da missão"
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
      </header>
      <div className="task-grid">
        {tasks.map((task) => (
          <article key={task.id} className={`task-card status-${task.status}`}>
            <header>
              <div>
                <p className="eyebrow">{task.priority.toUpperCase()}</p>
                <h3>{task.title}</h3>
              </div>
              <button className="ghost sm" onClick={() => onDelete(task)}>
                remover
              </button>
            </header>
            {task.description && <p className="muted">{task.description}</p>}
            <footer>
              <small>{formatDate(task.due_date)}</small>
              <button className="ghost sm" onClick={() => onToggle(task)}>
                {task.status === "done" ? "Reabrir" : "Concluir"}
              </button>
            </footer>
          </article>
        ))}
        {tasks.length === 0 && <p className="muted">Nenhuma missão por aqui. Crie algo épico.</p>}
      </div>
    </section>
  );
};

export default TaskBoard;
