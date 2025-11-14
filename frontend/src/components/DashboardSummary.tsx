import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { DashboardSummary } from "../types";

type StatusSlice = {
  label: string;
  value: number;
  color: string;
};

type Props = {
  summary: DashboardSummary | null;
  statusBreakdown: StatusSlice[];
};

export const DashboardSummary = ({ summary, statusBreakdown }: Props) => {
  if (!summary) {
    return (
      <section className="card glass">
        <p className="muted">Carregando visão geral...</p>
      </section>
    );
  }

  const cards = [
    {
      label: "Total de tarefas",
      value: summary.total_tasks,
      accent: "teal"
    },
    {
      label: "Concluídas",
      value: summary.completed_tasks,
      accent: "purple"
    },
    {
      label: "Taxa de conclusão",
      value: `${summary.completion_rate}%`,
      accent: "magenta"
    },
    {
      label: "Próximos 3 dias",
      value: summary.upcoming_tasks,
      accent: "amber"
    }
  ];

  return (
    <section className="card glass">
      <header>
        <p className="eyebrow">Painel tático</p>
        <h2>Resumo operacional</h2>
      </header>
      <div className="summary-layout">
        <div className="summary-grid">
          {cards.map((card) => (
            <article key={card.label} className={`summary-card accent-${card.accent}`}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </article>
          ))}
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {statusBreakdown.map((segment) => (
                  <Cell key={segment.label} fill={segment.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name, entry) => [`${value} tarefas`, (entry.payload as StatusSlice).label]}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="chart-legend">
            {statusBreakdown.map((segment) => (
              <li key={segment.label}>
                <span style={{ background: segment.color }} />
                {segment.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DashboardSummary;
