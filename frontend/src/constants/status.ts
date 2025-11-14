import type { StatusValue } from "../types";

export type StatusConfig = {
  value: StatusValue;
  label: string;
  color: string;
};

export const STATUS_CONFIG: StatusConfig[] = [
  { value: "backlog", label: "Pendente", color: "#38bdf8" },
  { value: "in_progress", label: "Em Progresso", color: "#a855f7" },
  { value: "done", label: "Concluída", color: "#34d399" }
];

export const STATUS_LABEL_BY_VALUE: Record<StatusValue, string> = STATUS_CONFIG.reduce(
  (acc, item) => {
    acc[item.value] = item.label;
    return acc;
  },
  {} as Record<StatusValue, string>
);

export const NORMALIZE_STATUS = (value: string): StatusValue => {
  if (value === "in_progress" || value === "done") {
    return value;
  }
  return "backlog";
};
