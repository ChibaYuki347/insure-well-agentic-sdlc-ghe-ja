# InsureWell

> **日本語ローカライズ用コピー / Japanese localization copy.**
> Source: [im-naga-ghas/insure-well-agentic-sdlc-ghe](https://github.com/im-naga-ghas/insure-well-agentic-sdlc-ghe).
> このリポジトリは上記ワークショップを日本語向けに調整するための独立コピーです。
> アジェンダは改訂済み — [handbook/Agenda.md](handbook/Agenda.md) (EN) / [handbook/Agenda.ja.md](handbook/Agenda.ja.md) (JA) / [改訂理由](handbook/Agenda-Revision.md)。
>
> **日本語セッション資料（10:30〜16:30・対面ハンズオン・1日）:**
> - 進行台本: [handbook/Instructor-Runbook.ja.md](handbook/Instructor-Runbook.ja.md)
> - 概念プライマー: [handbook/guides/0.Concepts-Primer.ja.md](handbook/guides/0.Concepts-Primer.ja.md)
> - 事前課題: [handbook/setup/1.Prerequisites.ja.md](handbook/setup/1.Prerequisites.ja.md)
> - ローカル MCP 設定: [handbook/setup/3.MCP-Local-Setup.ja.md](handbook/setup/3.MCP-Local-Setup.ja.md)
> - MCP フォールバック（MCPなしで進める）: [handbook/setup/4.MCP-Fallback.ja.md](handbook/setup/4.MCP-Fallback.ja.md)
> - 事前作成Issue: [docs/seed-issues.md](docs/seed-issues.md) / [scripts/create-seed-issues.sh](scripts/create-seed-issues.sh)
> - Codespaces で参加: [handbook/guides/8.Codespaces.ja.md](handbook/guides/8.Codespaces.ja.md)
> - カスタムエージェント演習: [handbook/guides/7.Custom-Agents-Exercise.ja.md](handbook/guides/7.Custom-Agents-Exercise.ja.md)
> - ⚠️ MCP はローカル限定（リモート MCP 禁止）。

A lightweight health insurance management system built with a **React** frontend and a **Java Spring Boot** backend.

---

## Features (Phase 1 MVP)

- **Policy Dashboard** — view policy details (ID, plan name, coverage amount, status, dates) with per-policy stats and recent claims
- **Multi-policy support** — clickable tabs to switch between policies without a page reload
- **Claims Module** — submit claims (amount, description, optional file upload), filter by policy, and track status (Pending / Approved / Rejected)
- **REST API** — JSON endpoints for policy and claim operations
- **Seeded sample data** — H2-backed backend starts with sample policies and claims for local development

---

## Screenshots

### Dashboard

![InsureWell Dashboard](images/insurewell-dashboard.png)

### Claims

![InsureWell Claims](images/insurewell-claims.png)

---

## Project Structure

```
InsureWell/
├── src/
│   ├── backend/            # Spring Boot API, entities, repositories, seed data
│   ├── frontend/           # React UI
│   ├── run.sh              # Starts backend and frontend together
│   └── README.md           # Short source-tree note
├── docs/                   # Architecture and data model docs
├── handbook/               # Workflow and setup guides
├── images/                 # Supporting images and demo assets
└── README.md
```

---

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- npm 9+

---

## Setup

### Option A — GitHub Codespaces (no local install)

Open the repo on GitHub → **`< > Code`** → **Codespaces** → **Create codespace on main**.
Java 17, Maven, Node 20, and the required VS Code extensions are provisioned automatically
(see [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json)). Then:

```bash
cd src
chmod +x run.sh
./run.sh
```

Open the forwarded **port 3000** from the **PORTS** tab. The frontend reaches the backend
through a dev-server proxy (`/api` → `:8080`), so only port 3000 is needed.
See [Codespaces guide (JA)](handbook/guides/8.Codespaces.ja.md).

### Option B — Local

```bash
# 1. Clone the repository
git clone <repo-url>
cd insure-well-agentic-sdlc-ghe

# 2. Start the backend and frontend
cd src
chmod +x run.sh
./run.sh
```

Open **http://localhost:3000** in your browser.

The backend API runs on **http://localhost:8080/api** and is seeded with sample policies and claims on startup. The script installs frontend dependencies automatically if `node_modules` is missing.

---

## Documentation Map

- Root [README.md](README.md): overview, quick start, and repository layout
- Source tree [src/README.md](src/README.md): architecture, detailed backend/frontend commands, API reference, sample data, and development notes
- Architecture docs [docs/InsureWell_HLD.md](docs/InsureWell_HLD.md) and [docs/InsureWell_DataModel.md](docs/InsureWell_DataModel.md): system design and data model
- Workflow guides under [handbook](handbook): setup and demo flow material

---

## Future Phases

The codebase is intentionally modular — new routes, templates, and data fields can be added without restructuring:

| Phase | Feature |
|-------|---------|
| 2 | Doctor / hospital provider search |
| 3 | Payment integration |
| 4 | Email / SMS notifications |
| 5 | Family member management |
| 6 | Admin panel with claim adjudication |
