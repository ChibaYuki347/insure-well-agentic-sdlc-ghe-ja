#!/usr/bin/env bash
#
# create-seed-issues.sh — Bulk-create the workshop seed issues with the GitHub CLI.
#
# This is the MCP-less backup path for the "Create Issues" phase: if the GitHub MCP
# server is unavailable or restricted, a facilitator can pre-create the backlog issues
# directly with `gh`. The issue content mirrors docs/seed-issues.md (derived from the
# prioritized backlog in docs/BRD.md §10).
#
# Usage:
#   ./scripts/create-seed-issues.sh --repo <owner>/<name> [--dry-run]
#   REPO=<owner>/<name> ./scripts/create-seed-issues.sh
#
# Options:
#   -R, --repo <owner/name>   Target repository (required; or set REPO env var).
#   -n, --dry-run             Print what would be created without calling the API.
#   -h, --help                Show this help.
#
# Requirements:
#   - GitHub CLI (`gh`) installed and authenticated: `gh auth login`
#   - Write access (issues) to the target repository.
#
# Note: Re-running creates duplicate issues. Run once, or delete duplicates afterward.

set -euo pipefail

REPO="${REPO:-}"
DRY_RUN=0

usage() { sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    -R|--repo) REPO="${2:-}"; shift 2 ;;
    -n|--dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 2 ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "ERROR: target repository not set. Use --repo <owner>/<name> or REPO=<owner>/<name>." >&2
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI (gh) not found. Install it and run 'gh auth login'." >&2
  exit 2
fi

# Labels used by the seed issues. Created if missing (ignored if they already exist).
LABELS=(enhancement backend frontend auth admin P1 P2)

ensure_labels() {
  for label in "${LABELS[@]}"; do
    if [[ "$DRY_RUN" -eq 1 ]]; then
      echo "[dry-run] ensure label: $label"
    else
      gh label create "$label" --repo "$REPO" >/dev/null 2>&1 || true
    fi
  done
}

# create_issue <title> <labels-csv> <body>
create_issue() {
  local title="$1" labels="$2" body="$3"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "------------------------------------------------------------"
    echo "[dry-run] would create issue in $REPO"
    echo "  title : $title"
    echo "  labels: $labels"
    echo "  body  :"
    echo "$body" | sed 's/^/    /'
    return 0
  fi
  gh issue create --repo "$REPO" --title "$title" --label "$labels" --body "$body"
}

ensure_labels

create_issue \
  "User authentication & role-based authorization" \
  "enhancement,backend,frontend,auth,P1" \
  "$(cat <<'EOF'
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
EOF
)"

create_issue \
  "Policyholder claim history, status & timeline" \
  "enhancement,frontend,backend,P1" \
  "$(cat <<'EOF'
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
EOF
)"

create_issue \
  "Admin claim review workspace with notes & actions" \
  "enhancement,backend,frontend,admin,P1" \
  "$(cat <<'EOF'
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
EOF
)"

create_issue \
  "Notification triggers for key claim events" \
  "enhancement,backend,P1" \
  "$(cat <<'EOF'
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
EOF
)"

create_issue \
  "Search, filter, sort & pagination for policies/claims" \
  "enhancement,backend,frontend,P2" \
  "$(cat <<'EOF'
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
EOF
)"

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "------------------------------------------------------------"
  echo "[dry-run] 5 issues would be created in $REPO. Re-run without --dry-run to apply."
else
  echo "Done. Created 5 seed issues in $REPO."
fi
