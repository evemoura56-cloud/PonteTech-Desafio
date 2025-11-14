# PonteTech — Desafio Técnico Full Stack

Aplicação criada para gestão de usuários, autenticação e acompanhamento de tarefas em um fluxo simples e direto. Todo o sistema foi desenvolvido com foco em clareza, organização e entrega de valor real, mantendo uma base sólida tanto no backend quanto no frontend. ✨

## Tecnologias Utilizadas

### Backend
- Python 3.12  
- FastAPI  
- SQLAlchemy 2  
- Alembic  
- PostgreSQL  
- Pytest  
- JWT + Bcrypt  

### Frontend
- React + Vite  
- Recharts  

### Infraestrutura
- Docker e Docker Compose  

## Arquitetura do Projeto

O backend segue uma estrutura em camadas que separa responsabilidades e facilita manutenção. As rotas chamam serviços, os serviços manipulam regras e acessam o banco por meio dos modelos do SQLAlchemy. Schemas Pydantic validam entradas e saídas.  
As migrations Alembic versionam mudanças no banco e as seeds inserem dados iniciais automaticamente.  
O frontend foi organizado em componentes, hooks e chamadas isoladas para a API.

### Estrutura de diretórios

PonteTech-Desafio/
├── backend/
│ ├── alembic/
│ ├── app/
│ │ ├── api/
│ │ ├── core/
│ │ ├── db/
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── services/
│ │ ├── seeds/
│ │ └── utils/
│ ├── requirements.txt
│ └── tests/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── constants/
│ │ └── styles.css
│ └── package.json
└── docker-compose.yml


## Autenticação

O sistema permite criar usuários com senha criptografada.  
O login gera um token JWT com validade de sete dias.  
As rotas protegidas exigem o token no cabeçalho Authorization.

## Funcionalidades Implementadas

### Backend
- Cadastro de usuário  
- Login com JWT  
- CRUD de tarefas  
- Atualização de status  
- Validação de status permitido (Pendente, Em Progresso, Concluída)  
- Consultas para métricas  
- Seeds automáticas  
- Migrations Alembic  
- Testes com Pytest  

### Frontend
- Tela de login  
- Tela de registro  
- Dashboard com métricas  
- Cards de contagem  
- Gráfico de pizza com Recharts  
- Lista de tarefas  
- Criação de tarefas com status  
- Busca por título  
- Marcar como favorita ⭐  

## Como Rodar com Docker

1. Criar o arquivo `backend/.env` com:

DATABASE_URL=postgresql+psycopg2://appuser:apppass@db:5432/appdb
JWT_SECRET=uma_senha_segura
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=7


2. Subir o projeto:
docker compose up --build

3. Acessar:
- Backend: http://localhost:8000/docs  
- Frontend: http://localhost:5173  

## Testes

Para executar:
cd backend
pytest


Os testes cobrem registro, login e operações de tarefas.

## Decisões Técnicas

FastAPI foi escolhido pela organização clara do fluxo de desenvolvimento e facilidade de manutenção.  
A arquitetura modular permite evolução sem impactos desnecessários.  
JWT resolve autenticação sem armazenar sessão no servidor.  
Docker Compose garante que tudo suba do mesmo jeito em qualquer ambiente.  
Os testes foram incluídos para validar os fluxos principais exigidos no desafio.

## Regras do Desafio

Todos os requisitos do arquivo `DESAFIO_SIMPLIFICADO.md` foram atendidos.

## Considerações Finais

Projeto desenvolvido com atenção a boas práticas, clareza e consistência. Pronto para ser executado, avaliado e expandido. 🚀