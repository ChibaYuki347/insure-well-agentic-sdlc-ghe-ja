# Agenda Review & Revision Notes

> Why the workshop agenda was revised. The original single-day agenda was over-packed
> with a fragile linear dependency chain and no buffer. This document records the
> problems found and the changes made in [Agenda.md](Agenda.md) /
> [Agenda.ja.md](Agenda.ja.md).

---

## 1. Summary

The workshop runs **10:00 AM – 4:00 PM (360 min)**. After lunch (45 min) and the
coffee break (15 min), only **~300 min (5 h)** of working time remains. The original
agenda packed **13 phases / 15+ first-time tools** (GitHub MCP, Playwright MCP, ADO
MCP, four custom agents, Issues, UI delegation, VS Code local & cloud agents, PR
review, CodeQL, Dependabot, secret scanning, ADO pipeline, local run) into that window
with **no buffer and no Q&A**.

---

## 2. Problems

### P1 — A single linear dependency chain with zero slack (most critical)
Setup → MCP → Requirements → Issues → Coding → Review → CI → GHAS → QA → Run is one
unbroken chain. Each step depends on the previous step's output — especially the
**non-deterministic, slow output of AI agents**. Any slip cascades downstream, yet
there was not a single minute of buffer across six hours.

### P2 — The cloud coding agent's latency was not exploited
"Delegate a feature from the GitHub UI → PR" was placed **immediately before lunch**.
A realistic feature (auth: Spring Security + JPA + React + tests) often takes 10–30+
min just to produce a PR. If it overran, participants broke for lunch with a broken
state. Cloud agents are meant to **run asynchronously** — kick one off *before* lunch
so it runs *during* lunch.

### P3 — Prerequisites sat on the day's critical path (double-booked)
The handbook already states prerequisites must be done **before 10:00 AM**, yet the
agenda re-allocated 10:00–10:30 to them. Installs/PAT setup is the #1 time sink and the
#1 cause of "it only fails on my machine" in live, multi-laptop sessions.

### P4 — 15-minute slots were unrealistic for their content
- **ADO pipeline CI (15 min):** Requires an ADO PAT, the ADO MCP server, and an
  ADO↔GHE integration — an entire second toolchain. Not feasible in 15 min.
- **QA + Playwright (15 min):** Generating test cases + a test suite + browser
  exercises in 15 min is impossible. The Workshop Guide devotes a whole section (§8)
  with multiple exercises to Playwright alone.

### P5 — The finale was high-risk
"Run the AI-generated app locally, end-to-end" assumes agent-generated, recently-merged
code builds and runs. If it does not compile, the climax fails — and there was no
remediation buffer.

### P6 — Ordering and Guide inconsistencies
- Requirements were split **Phase-1 (create Issues) → Phase-2 (generate stories)** —
  the reverse of the logical order. The Workshop Guide's demo flow correctly does
  HLD → BRD → Issues.
- The Guide's demo flow **Step 1 is the HLD agent**, but the agenda had **no design
  phase** — it jumped straight from requirements to coding.

### P7 — Heavy cognitive load stacked at the end
GHAS → QA → E2E — three demanding blocks — were piled into the final 75 minutes, when
energy is lowest.

---

## 3. Changes Made

| Problem | Change |
| --- | --- |
| P3 | Prerequisites moved to pre-work; the day starts with a 20-min smoke-check. Added an optional **Prerequisites Office Hours, 9:30–10:00**. |
| P2 | Cloud coding agent is **kicked off at 11:50, just before lunch**, so it runs asynchronously during the 45-min break. |
| P4 | **ADO CI demoted to optional / homework** (removes the second toolchain). **QA + Playwright expanded 15 → 40 min.** |
| P5 | **Local E2E given 25 min including a buffer** to absorb build breaks from agent-generated code. |
| P6 | Requirements reordered to **BRD → Issues**, with **HLD (design) added** to match the Workshop Guide. |
| P1 / P7 | Explicit **buffer** in the E2E slot and a dedicated **Wrap-up / Q&A** at 3:50–4:00. |

---

## 4. Decisions

These were confirmed before finalizing the agenda:

1. **Azure DevOps CI** → **optional / homework** (out of the core session).
2. **Scope** → **one feature for the day** (e.g., authentication), not per-participant features.
3. **Prerequisites Office Hours (9:30–10:00)** → **added** to the official schedule.

---

## 5. v2 — June 22 (Japanese session) adjustments

Driven by the planning meeting for the Japanese, on-site, in-person session.

| Change | Why |
| --- | --- |
| **Window shifted 10:00–16:00 → 10:30–16:30** | Matches the confirmed venue booking. Same 360-min span; everything shifts +30 min, Office Hours becomes 10:00–10:30. |
| **Added a 35-min Concept Primer (10:45–11:20)** | The instructor's request: the Japanese audience needs the *concepts* first — what a BRD is, what MCP is, its **principles, kinds (local vs remote), and discovery scopes** — before hands-on. New doc: `guides/0.Concepts-Primer.ja.md`. |
| **MCP made local-only across all docs** | The organization's policy **forbids remote MCP**. All MCP runs locally via `.vscode/mcp.json` + `npx` pulling from a **private** registry (workspace scope). New doc: `setup/3.MCP-Local-Setup.ja.md` + template `setup/mcp.local.json`. |
| **Added per-phase backup / fallback plans** | The instructor's concern: the chain is linear, so a failure in one phase blocks the next. Captured in `Instructor-Runbook.ja.md` (e.g., create Issues directly on github.com if MCP sync fails; pull a reference branch if the cloud agent's PR is unusable). |
| **Added a 15-min Custom Agents Exercise (16:00–16:15)** | The India sessions closed with a "build your own custom agent" activity. New doc: `guides/7.Custom-Agents-Exercise.ja.md`. |
| **Prerequisites moved to the day before; JA pre-work doc added** | Setup/MCP is the #1 time sink; doing it the day before frees the morning. New doc: `setup/1.Prerequisites.ja.md`. |
| **Added a Japanese instructor runbook** | A run-of-show with timing cues, talking points, cloud-agent kickoff timing, facilitation tips, and backup triggers. New doc: `Instructor-Runbook.ja.md`. |

> **Framing reaffirmed:** completion is *not* the goal. Not everyone will finish every
> phase; the goal is exposure to the new way of working ("art of the possible"). The
> environment stays available afterward, so participants can continue on their own.

### Open items (to confirm with the customer organizer)
- The real `.vscode/mcp.json` and the **private npm registry URL / auth** are provided by
  the customer organizer. Our `setup/mcp.local.json` is a template with placeholders.
- The customer-org workshop repo (private, ~90% identical) is provided/cloned by the team.
