# Gutlog

A private, offline-first IBD & symptom tracker (PWA). Self-contained `index.html`
plus `gutlog.core.js` (pure symptom logic, tested with `bun test`). No build step,
no runtime dependencies; all data stays in the browser on the user's device.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues (via the `gh` CLI). External PRs
are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical label vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root (created lazily by the
domain-modeling skills, not upfront). See `docs/agents/domain.md`.
