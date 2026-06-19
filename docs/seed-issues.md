# Seed Issues（事前作成Issue — MCPなしのバックアップ用）

> **用途:** MCP の設定が間に合わない／使えない場合でも、ワークショップを止めないための
> **事前作成Issue**の文面集です。下記いずれかで GitHub Issue を用意できます。
> 1. **一括スクリプト**: [`scripts/create-seed-issues.sh`](../scripts/create-seed-issues.sh)（`gh` CLI）
> 2. **手動**: 各 Issue の Title / Body をコピーして github.com の **New issue** に貼り付け
>
> 元になった優先度付きバックログ: [docs/BRD.md](BRD.md) §10 ・ 代替手順全体: [handbook/setup/4.MCP-Fallback.ja.md](../handbook/setup/4.MCP-Fallback.ja.md)

当日扱う主機能は **ISSUE-1（認証）** を推奨します（E2E を完走しやすい）。

---

## ISSUE-1 — User authentication & role-based authorization (P1) ⭐当日の主機能

**Labels:** `enhancement`, `backend`, `frontend`, `auth`, `P1`

**Body:**

```
**As a** policyholder,
**I want to** log in with a username and password,
**so that** my policies and claims are private and protected.

### Background
The InsureWell MVP has no authentication; any user can read/modify all policies and
claims (see docs/BRD.md §8). This is the P1 foundation feature.

### Acceptance Criteria
- AC1: Backend exposes login/logout using Spring Security; passwords are hashed (BCrypt).
- AC2: A Users model is persisted via JPA/H2; a default demo admin user is seeded.
- AC3: React provides sign-in / sign-out UI; unauthenticated users cannot reach claims/policy actions.
- AC4: Policy and claim API endpoints require authentication/authorization.
- AC5: Backend and frontend tests cover login success/failure and protected access.

### Definition of Done
- [ ] Backend implemented and unit tested
- [ ] Frontend implemented
- [ ] Acceptance criteria verified
- [ ] Code reviewed and merged
```

---

## ISSUE-2 — Policyholder claim history, status & timeline (P1)

**Labels:** `enhancement`, `frontend`, `backend`, `P1`

**Body:**

```
**As a** policyholder,
**I want to** see the history and a timeline of my claim status changes,
**so that** I understand where each claim is in the review process.

### Acceptance Criteria
- AC1: Each claim shows a chronological timeline of status transitions.
- AC2: Status labels are understandable to non-technical users.
- AC3: Empty/loading/error states are handled clearly.

### Definition of Done
- [ ] Backend implemented and unit tested
- [ ] Frontend implemented
- [ ] Acceptance criteria verified
- [ ] Code reviewed and merged
```

---

## ISSUE-3 — Admin claim review workspace with notes & actions (P1)

**Labels:** `enhancement`, `backend`, `frontend`, `admin`, `P1`

**Body:**

```
**As a** claims adjuster/admin,
**I want to** review claims with notes and action controls,
**so that** I can process claims operationally and keep an audit trail.

### Acceptance Criteria
- AC1: Admins can view a claim queue and open a claim for review.
- AC2: Admins can add notes and change status with the change recorded.
- AC3: Role-based access restricts admin actions to admin users.

### Definition of Done
- [ ] Backend implemented and unit tested
- [ ] Frontend implemented
- [ ] Acceptance criteria verified
- [ ] Code reviewed and merged
```

---

## ISSUE-4 — Notification triggers for key claim events (P1)

**Labels:** `enhancement`, `backend`, `P1`

**Body:**

```
**As a** policyholder,
**I want to** be notified when my claim status changes,
**so that** I stay informed without polling the app.

### Acceptance Criteria
- AC1: A notification is triggered on claim submission, approval, rejection, and info-request.
- AC2: Email is the first channel (others are future options).
- AC3: Notification sending is abstracted so the channel can be swapped.

### Definition of Done
- [ ] Backend implemented and unit tested
- [ ] Acceptance criteria verified
- [ ] Code reviewed and merged
```

---

## ISSUE-5 — Search, filter, sort & pagination for policies/claims (P2)

**Labels:** `enhancement`, `backend`, `frontend`, `P2`

**Body:**

```
**As an** admin,
**I want to** search, filter, sort, and paginate policies and claims,
**so that** I can manage larger datasets efficiently.

### Acceptance Criteria
- AC1: List views support filter by status/plan type and free-text search.
- AC2: Results are paginated and sortable.
- AC3: Queries return within ~2s for demo-scale data.

### Definition of Done
- [ ] Backend implemented and unit tested
- [ ] Frontend implemented
- [ ] Acceptance criteria verified
- [ ] Code reviewed and merged
```
