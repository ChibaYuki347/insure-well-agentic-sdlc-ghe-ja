// Display-label helpers for Japanese UI.
// IMPORTANT: status *values* (e.g. "Pending", "active") are sent to/from the backend
// and used by Playwright tests, so they must stay in English. Only the displayed
// label is localized here.

export const CLAIM_STATUS_LABELS = {
  Pending: '審査中',
  Approved: '承認済み',
  Rejected: '却下',
};

export const POLICY_STATUS_LABELS = {
  active: '有効',
  inactive: '無効',
};

export const claimStatusLabel = (status) => CLAIM_STATUS_LABELS[status] || status;
export const policyStatusLabel = (status) => POLICY_STATUS_LABELS[status] || status;
