# Proposals — W-GOV-001

## P-001 — Work Operating System v1

Status: APPROVED
Created: 2026-10-07

### Problem / Need

Project-level memory can recover the repository state, but it does not reliably preserve the detailed state of each concrete task: what was proposed, whether it was approved, what was actually changed, where it changed, what was wrong, what was confirmed, and how it was verified.

The existing `憲法から` macro was also too permissive because it could proceed from strategy directly to execution without an explicit approval-state check.

### Proposed Solution

Introduce a first-class Work unit with:

- stable Work ID
- explicit status machine
- proposal approval gate
- `WORK.md`
- `PROPOSAL.md`
- `ACTION_LOG.md`
- `FINDINGS.md`
- `VERIFICATION.md`
- error taxonomy and CONFIRMED findings
- promotion rules from local Work records to Decisions/Lessons/current-state memory
- revised `憲法から` logic that proceeds only as far as approval permits

### Scope

Governance/process documentation, templates, validation, and memory records.

### Out of Scope

Runtime feature implementation, curriculum changes, destructive migration of legacy work records.

### Expected Affected Areas

- `AGENTS.md`
- `governance/`
- `work/`
- `memory/DECISIONS/`
- `memory/LESSONS/`
- repository governance validator

### Risks

- making records too verbose
- confusing findings with decisions
- repeatedly asking for already-recorded approval
- incorrectly treating user intent as proposal approval

### Verification Plan

- check all required files exist
- validate Work state values
- validate each Work item has five required records
- run governance CI
- run normal PR checks

### Approval

Status: APPROVED
Approved by user: YES
Approval date: 2026-10-07
Approval evidence: user explicitly accepted the integrated design and instructed “じゃデザインよろしく”.
