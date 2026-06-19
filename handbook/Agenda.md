# Agenda

**Tech Stack:** React UI + Java Spring Boot backend
**Format:** 10:30–16:30 · on-site, in-person · single-day hands-on
**Full workshop guide:** [Workshop-Guide.md](Workshop-Guide.md) · **Instructor runbook:** [Instructor-Runbook.ja.md](Instructor-Runbook.ja.md)
**日本語版:** [Agenda.ja.md](Agenda.ja.md) · **Why this changed:** [Agenda-Revision.md](Agenda-Revision.md)

> **Prerequisites are pre-work.** Complete the [Prerequisites Checklist](setup/1.Prerequisites.md)
> — installs, PAT, clone & run the app, and a **local MCP dry-run** — **the day before**.
> On the day we only run a quick smoke-check.

> ⚠️ **MCP is local-only** (the organization's policy forbids remote MCP). See
> [setup/3.MCP-Local-Setup.ja.md](setup/3.MCP-Local-Setup.ja.md).

---

## Pre-work (the day before)

- Complete prerequisite installs (Java, Node.js, VS Code + extensions, Git, PAT).
- Clone the repo and run the app once locally so you know it works.
- **Dry-run the local MCP** (`.vscode/mcp.json` via `npx` from the private registry) — the #1 time sink.
- **Optional Prerequisites Office Hours — 10:00–10:30** for anyone still blocked.

> 💡 To avoid local installs, **GitHub Codespaces** is available (no install, identical env).
> MCP still runs locally, same as on a laptop. See [guides/8.Codespaces.ja.md](guides/8.Codespaces.ja.md).

---

| Time | Phase | What Happens | What You Walk Away With |
| --- | --- | --- | --- |
| 10:00–10:30 | **Prereq Office Hours** *(optional)* | Drop-in help for installs/access/MCP | A working environment before the main session |
| 10:30–10:45 | **Kickoff** | Environment smoke-check (run the verify script; quick fixes) | Confirmed-ready environment |
| 10:45–11:20 | **Concept Primer** | Agentic SDLC overview / **what is a BRD** / **what is MCP (principles, kinds, scopes)** | Shared "what, why, and how it works" |
| 11:20–11:45 | **MCP (local) & Agents** | Configure local MCP in `.vscode/mcp.json`; intro to custom agents and how to invoke them | Copilot connected to GitHub; agents ready |
| 11:45–12:20 | **Requirements & Design** | HLD agent → BRD agent → prioritized backlog | Architecture overview + a prioritized backlog |
| 12:20–12:35 | **Create Issues** | File GitHub Issues from the backlog; **pick ONE feature for the day** | Backlog in GitHub; scope fixed to one feature |
| 12:35–12:45 | **Delegate to Cloud Agent** | Kick off the cloud coding agent on the chosen feature | Agent starts working asynchronously |
| 12:45–13:30 | **Lunch** | Lunch break — the cloud agent keeps running in the background | — |
| 13:30–14:10 | **Coding Phase** | Review the agent's PR; use the VS Code local agent to fix/extend; iterate | A working feature branch / PR |
| 14:10–14:40 | **Code Review Phase** | Copilot auto code review + CodeQL scan + human approval → merge | A reviewed and merged PR |
| 14:40–14:55 | **Coffee Break** | Short break | — |
| 14:55–15:25 | **GHAS** | Review AI findings, Dependabot alerts, and secret scanning results | Hands-on with GitHub Advanced Security |
| 15:25–16:00 | **QA + Playwright** | QA agent generates test cases and a test suite; interactive browser validation via Playwright MCP | Automated test coverage + UI validation |
| 16:00–16:15 | **Custom Agents Exercise** | Give a scenario; each participant authors a `.agent.md`, invokes it; a few present | Hands-on building a custom agent |
| 16:15–16:30 | **Wrap-up / Buffer / Q&A** | Recap and next steps; time reserved for troubleshooting | Clear takeaways and follow-ups |

---

## Optional / Homework

- **Azure DevOps CI pipeline** — Trigger and verify CI for the generated code in Azure
  DevOps. This requires an ADO PAT, the ADO MCP server, and an ADO↔GHE integration, so
  it is **out of the core session** and offered as optional follow-up work. See
  [2.Azure-DevOps-Setup.md](setup/2.Azure-DevOps-Setup.md).
- **Continue the custom-agents exercise** — the environment stays available afterward.

---

## Notes on Pacing

- **Prerequisites are done the day before** — the morning starts with a smoke-check, not installs.
- **MCP is local-only** (no remote MCP) — `npx` pulls from the organization's private registry.
- **Concept primer up front** — cover BRD / MCP (principles, kinds, scopes) in Japanese before hands-on.
- **The cloud coding agent is kicked off just before lunch** so it runs asynchronously during the break.
- **Scope is fixed to one feature** (e.g., authentication) to keep the end-to-end flow achievable.
- **Each phase has a backup plan** so a slip in the linear chain doesn't block downstream work ([runbook](Instructor-Runbook.ja.md)).
- **Buffer at the end** absorbs build breaks and troubleshooting.
- **Completion is not the goal** — the goal is to experience the new way of working (the env stays available).
- **Azure DevOps CI is optional / homework**, keeping the core session GitHub-centric.
