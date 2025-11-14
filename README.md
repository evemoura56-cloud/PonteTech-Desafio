# PonteTech Mission Control

Plataforma full-stack pensada para o desafio técnico da PonteTech. O objetivo é entregar uma base sênior, simples e preparada para evoluir: autenticação sólida, camadas isoladas, telemetria estruturada e um frontend futurista integrado à API.

## Arquitetura

- **Backend**: FastAPI + SQLAlchemy 2.0 + Alembic + PostgreSQL. Estrutura seguindo princípios de arquitetura limpa (core, models, schemas, services, api, utils). Autenticação via JWT (7 dias), senhas em bcrypt, middlewares de segurança e logs estruturados com Structlog.
- **Frontend**: React + Vite + TypeScript com UI futurista que consome a API (login, dashboard, backlog).
- **Infra**: Docker Compose orquestrando banco, backend e frontend. Seeds automáticas e migrations executadas no entrypoint do container.
- **Qualidade**: Pytest para auth/tasks (≥40% cobertura dos fluxos críticos), validações fortes e linters configuráveis via `pyproject.toml`.

## Pré-requisitos

- Docker 24+ e Docker Compose v2
- Make/PowerShell (opcional para comandos locais)
- Para desenvolvimento local direto: Python 3.11, Node 18, PostgreSQL 15

## Executando tudo com Docker

```bash
docker compose up --build
```

Serviços expostos:

- Backend FastAPI: http://localhost:8000
- Frontend futurista (Vite): http://localhost:5173
- PostgreSQL: localhost:5432 (user/password: `ponte`)

O entrypoint do backend roda automaticamente:

1. `alembic upgrade head` – aplica migrations
2. `python -m app.seeds.seed_data` – injeta usuário líder + backlog demonstrativo
3. `uvicorn app.main:app --host 0.0.0.0 --port 8000`

## Desenvolvimento local (sem Docker)

```bash
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env  # ajuste DATABASE_URL/SECRET_KEY
alembic -c backend/alembic.ini upgrade head
python -m app.seeds.seed_data
uvicorn app.main:app --reload --app-dir backend/app
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Defina `VITE_API_URL=http://localhost:8000` (arquivo `.env` na pasta frontend) caso precise apontar para outro host.

## Estrutura de diretórios

```
backend/
  app/
    api/             # Rotas FastAPI organizadas por contexto
    core/            # Config, segurança, dependências
    db/              # Engine + base declarativa
    models/          # SQLAlchemy 2.0
    schemas/         # Pydantic v2
    services/        # Regras de negócio (auth, users, tasks)
    seeds/           # Scripts determinísticos de seed
    utils/           # Helpers (timestamps, validators)
    main.py          # Configuração FastAPI + middlewares
  tests/             # Pytest (auth + tasks)
  alembic/           # Migrações versionadas
frontend/            # React + Vite futurista
docker-compose.yml   # Orquestração
```

## Principais endpoints

| Método | Rota                | Descrição                         |
| ------ | ------------------- | --------------------------------- |
| POST   | `/auth/register`    | Cria usuário (valida senha forte) |
| POST   | `/auth/login`       | Autentica e retorna JWT (7 dias)  |
| GET    | `/tasks/`           | Lista tasks do usuário            |
| POST   | `/tasks/`           | Cria task                         |
| PUT    | `/tasks/{id}`       | Atualiza task                     |
| DELETE | `/tasks/{id}`       | Remove task                       |
| GET    | `/dashboard/summary`| Métricas para o painel futurista  |

Todas as rotas (exceto `/auth/*`) exigem header `Authorization: Bearer <token>`.

## Testes

```bash
cd backend
pytest --cov=app
```

Os testes usam SQLite isolado e garantem autenticação + CRUD de tasks. A cobertura mínima para o desafio é atendida (rotas centrais possuem asserts diretos).

## Convenções adicionais

- **Autenticação**: JWT assinado via `SECRET_KEY`, expira em 10080 minutos (7 dias). Senhas com bcrypt + validação (maiúscula, minúscula, número).
- **Logs**: Middleware com Structlog emitindo JSON + `X-Trace-Id` em cada resposta.
- **Segurança**: Middleware adiciona cabeçalhos (HSTS, X-Frame-Options, Permissions-Policy). CORS liberado para `FRONTEND_URL` configurado.
- **Seeds**: Usuário `leader@pontetech.com` + cinco iniciativas de exemplo. Ajuste em `app/seeds/seed_data.py` se quiser dados diferentes.

## Próximos passos sugeridos

1. Configurar CI (lint, testes, docker build) para manter o nível sênior.
2. Adicionar métricas Prometheus/OTLP se o ambiente exigir observabilidade em produção.
3. Evoluir o frontend com drag-and-drop para colunas e push notifications via WebSockets.

---

> **Observação**: todas as decisões acima obedecem ao `DESAFIO_SIMPLIFICADO.md`. Qualquer ajuste de regra pode ser feito editando esse arquivo e seguindo o mesmo pipeline (migrations + seeds + testes).
