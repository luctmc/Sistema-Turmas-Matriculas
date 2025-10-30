# Sistema de Turmas e Matrículas

Aplicação completa para gestão de cursos, turmas, estudantes e matrículas desenvolvida para a disciplina **Desenvolvimento de Framework II**. O projeto é composto por uma API Node.js (Express + Sequelize) com autenticação JWT e documentação via Swagger, além de um frontend React que consome a API. Toda a solução pode ser executada localmente com Docker e possui pipelines de CI/CD com GitHub Actions.

## 🧱 Arquitetura

```
root
├── backend/      # API REST em Node.js + Sequelize + Swagger
├── frontend/     # Interface web em React + Vite
├── docker-compose.yml
└── .github/workflows/ci.yml
```

### Principais tecnologias utilizadas

- **Backend:** Node.js, Express, Sequelize (PostgreSQL), JWT, Swagger UI, Express Validator
- **Frontend:** React + Vite, Axios
- **Infraestrutura:** Docker, Docker Compose, GitHub Actions, GitHub Container Registry

## ⚙️ Executando localmente

### Requisitos

- Node.js 20+
- Docker e Docker Compose

### Passos rápidos com Docker

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

Serviços disponíveis:

- API: http://localhost:3333/api
- Swagger: http://localhost:3333/docs
- Frontend: http://localhost:5173
- Banco de dados PostgreSQL: porta 5432

### Execução manual (sem Docker)

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env
   # garanta que DB_HOST=localhost para acessar o PostgreSQL local
   npm install
   # execute o PostgreSQL localmente ou suba apenas o serviço de banco com Docker
   docker compose up -d db
   npm run dev
   ```
   A API sobe na porta definida em `PORT` (padrão 3333). Caso o banco não esteja acessível será exibida uma mensagem com dicas de configuração.

2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   A interface fica disponível em `http://localhost:5173` e possui proxy configurado para `/api`.

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/login` e `/api/auth/register`) exigem token JWT no header `Authorization: Bearer <token>`. O fluxo sugerido:

1. Crie um usuário administrador usando `POST /api/auth/register` com `role=admin`.
2. Realize o login em `POST /api/auth/login` para receber o token e dados do usuário.
3. Utilize o token para acessar os demais endpoints ou simplesmente informe as credenciais na interface web.

## 📚 Documentação da API

A especificação Swagger é gerada automaticamente e pode ser acessada em `http://localhost:3333/docs`. Ela inclui todas as rotas de autenticação, cursos, estudantes, turmas e matrículas, já configuradas para exigir `bearerAuth`.

## 🗃️ Modelo de dados

- **User**: nome, email, senha (hash bcrypt) e perfil (`admin`, `teacher`, `assistant`).
- **Course**: informações do curso e carga horária.
- **Class**: turma vinculada a um curso com datas e capacidade máxima.
- **Student**: dados pessoais do estudante.
- **Enrollment**: relação estudante ↔ turma com status da matrícula.

As entidades são relacionadas via Sequelize e sincronizadas automaticamente no `bootstrap` da aplicação.

## 🧪 Testes e qualidade

O projeto inclui configuração básica do ESLint para manter a qualidade do código backend. O pipeline de CI executa:

- Instalação das dependências (backend e frontend)
- `npm run lint` no backend
- `npm run build` no frontend
- Build de imagem Docker para publicação no GitHub Container Registry
- Deploy do frontend para GitHub Pages (requer `GH_PAGES_TOKEN`)

## 🚀 Deploy contínuo

O workflow `.github/workflows/ci.yml` realiza automaticamente:

1. **Validação** do backend e frontend a cada push ou pull request.
2. **Publicação** do frontend no GitHub Pages (branch `main`) usando o token `GH_PAGES_TOKEN`.
3. **Build** e push da imagem do backend para o GitHub Container Registry (`ghcr.io`).

---

Projeto desenvolvido por **Grupo Trabalho 1 - Turma A - Desenvolvimento Framework II**.

Integrantes: 

1. Gabriel Luís Lopes – RA. 2300873
2. Lucas Timponi Mercadante Castro – RA. 2304913
3. Pedro Alexandre Dos Santos Chaves – RA. 2301503
