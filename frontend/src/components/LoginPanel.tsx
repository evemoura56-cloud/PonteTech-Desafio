import { useState } from "react";
import type { AuthPayload } from "../types";

type Props = {
  onLogin: (payload: AuthPayload) => Promise<void>;
  onRegister: (payload: AuthPayload) => Promise<void>;
};

const initialState: AuthPayload = {
  email: "",
  password: "",
  full_name: ""
};

export const LoginPanel = ({ onLogin, onRegister }: Props) => {
  const [form, setForm] = useState<AuthPayload>(initialState);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await onLogin(form);
      } else {
        await onRegister(form);
      }
      setForm(initialState);
    } catch (err) {
      setError("Não foi possível autenticar. Revise os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card glass">
      <header>
        <p className="eyebrow">PonteTech</p>
        <h1>{mode === "login" ? "Bem-vindo ao Mission Control" : "Criar nova credencial"}</h1>
        <p>Gerencie squads, crie fluxos e acompanhe seus pilotos usando uma interface futurista.</p>
      </header>
      <form onSubmit={handleSubmit} className="stack gap-md">
        {mode === "register" && (
          <label className="stack gap-xs">
            <span>Nome completo</span>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
            />
          </label>
        )}
        <label className="stack gap-xs">
          <span>E-mail corporativo</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value.trim() }))}
          />
        </label>
        <label className="stack gap-xs">
          <span>Senha</span>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Sincronizando..." : mode === "login" ? "Entrar no painel" : "Registrar tripulante"}
        </button>
      </form>
      <footer>
        <button
          className="ghost"
          type="button"
          onClick={() => {
            setMode((prev) => (prev === "login" ? "register" : "login"));
            setError(null);
          }}
        >
          {mode === "login" ? "Ainda não possui acesso?" : "Já tenho acesso"}
        </button>
      </footer>
    </section>
  );
};

export default LoginPanel;
