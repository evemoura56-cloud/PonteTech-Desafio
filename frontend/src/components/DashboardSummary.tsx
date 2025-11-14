import type { DashboardSummary } from "../types";

type Props = {
  summary: DashboardSummary | null;
};

export const DashboardSummary = ({ summary }: Props) => {
  if (!summary) {
    return (
      <section className="card glass">
        <p className="muted">Carregando telemetria...</p>
      </section>
    );
  }

  const cards = [
    {
      label: "Total de tasks",
      value: summary.total_tasks,
      accent: "teal"
    },
    {
      label: "Concluídas",
      value: summary.completed_tasks,
      accent: "purple"
    },
    {
      label: "Conclusão",
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
        <h2>Telemetria da frota</h2>
      </header>
      <div className="summary-grid">
        {cards.map((card) => (
          <article key={card.label} className={`summary-card accent-${card.accent}`}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DashboardSummary;
