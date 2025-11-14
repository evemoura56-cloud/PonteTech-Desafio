# Regras do Desafio PonteTech

1. Arquitetura limpa com separação clara de camadas (core, models, schemas, services, API e utils).
2. Backend em Python 3.11 usando FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic e PostgreSQL.
3. Autenticação JWT com validade de 7 dias, senhas com bcrypt, middlewares de segurança e logs estruturados.
4. Seeds automáticas e migrações versionadas prontas para rodar via Docker.
5. Testes unitários com Pytest garantindo cobertura mínima de 40% para fluxos críticos de auth e tasks.
6. Docker Compose orquestrando banco + backend + frontend futurista em um único comando.
7. README profissional com instruções completas.
