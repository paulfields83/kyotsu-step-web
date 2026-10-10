# Work Operating System

Status: CANONICAL
Version: 1.2.0
Updated: 2026-10-07

## 1. Purpose

This document defines how a concrete unit of work is proposed, approved, executed, recorded, verified, and handed to the next chat/agent.

A repository can remember the project correctly and still lose the history of a particular task. The Work Operating System closes that gap.

## 2. Core invariant

**An unapproved proposal must not silently become implementation.**

Before execution, an agent must determine whether the exact work proposal is already approved.

- If no approved proposal exists: investigate, write the proposal, present it to the user, and stop at the approval gate.
- If an approved proposal exists and the requested work is still inside that approved scope: continue without asking the same question again.
- If implementation discovers a material scope/design change: move the Work to `REVISE-PROPOSAL`, record why, propose the change, and wait for approval before executing the changed portion.
- **REVIEW-FEEDBACK ≠ APPROVAL.** If the user changes, adds, removes, rejects, or conditions any part of a proposal, do not infer a revised approval. Create and present the revised proposal, then wait for explicit approval of that revision.

## 3. Definition of Work

A **Work** is one traceable unit of activity with one clear objective and one stable Work ID.

A Work records:

- what the objective is,
- what was proposed,
- what the user approved,
- what actions were actually performed,
- where those actions occurred,
- what was found to be correct or wrong,
- how the result was verified,
- what must be promoted into project memory.

Example IDs:

- `W-GOV-001` — governance/process work
- `W-PHY-001` — Physics work
- `W-MATH-001` — Mathematics work
- `W-APP-001` — application/runtime work

The numeric suffix is stable once assigned.

## 4. Work state machine

```text
UNDEFINED
    ↓
PROPOSED
    ↓  explicit user approval
APPROVED
    ↓
IMPLEMENTING
    ↓
VERIFYING
    ↓
DONE
```

Exceptional states:

- `BLOCKED` — cannot proceed because required information/resource/authority is missing.
- `REVISE-PROPOSAL` — approved plan is no longer sufficient; a material change needs approval.
- `FAILED-VERIFICATION` — implementation exists but the required verification gate failed.

### Transition rules

1. Only explicit user approval may move a proposal from `PROPOSED` to `APPROVED`.
2. User feedback that modifies the proposal is review feedback, not approval, even when it contains positive wording such as “good”, “OK”, or 「結構」.
3. After material review feedback, move to `REVISE-PROPOSAL`, create a new proposal revision/ID, present the full revision, and stop.
4. Only explicit approval of that exact revised proposal may return the Work to `APPROVED`.
5. `APPROVED` authorizes only the recorded proposal and scope.
6. Mechanical implementation choices that do not change the approved intent/scope do not require repeated approval.
7. A material change to objective, user-visible behavior, pedagogy, data contract, destructive action, or approved scope invalidates automatic continuation.
8. `DONE` requires both verification and memory close.

## 5. Work record structure

New work uses:

```text
work/items/<WORK-ID>-<short-name>/
├── WORK.md
├── PROPOSAL.md
├── ACTION_LOG.md
├── FINDINGS.md
└── VERIFICATION.md
```

Legacy files under `work/active/` remain valid historical/active records until deliberately migrated. They are not deleted merely because this system exists.

## 6. WORK.md

The Work cover sheet. It must answer:

- Work ID
- Title
- Status
- Objective
- Authority / relevant canonical spec
- Branch
- Scope
- Do Not Touch
- Approved Proposal
- Current Step
- Next Step

A new chat should be able to understand the Work's current state from this file before reading detailed logs.

## 7. PROPOSAL.md

Stores the planned change and approval state.

Each proposal has a stable Proposal ID such as `P-001`.

Required information:

- problem / need
- proposed solution
- scope
- out of scope
- affected areas/files if known
- risks
- verification plan
- approval status
- approval evidence/date

If a proposal changes materially, create a new proposal revision/ID rather than rewriting history so that an old approval appears to cover a new plan.

## 8. ACTION_LOG.md

Stores what was actually done.

Each action uses a stable ID such as `A-001`.

Record:

- action
- target/location
- reason
- result
- evidence (commit, file, test, artifact, PR, etc.)
- related proposal/task when useful

This is the answer to: **what did the agent do, and where?**

Do not turn the Action Log into verbose chain-of-thought. Record observable actions, decisions, outputs, and evidence.

## 9. FINDINGS.md

Stores facts learned during the Work, including both correct and incorrect assumptions.

Each finding uses a stable ID such as `F-001`.

### Positive / neutral types

- `CONFIRMED` — verified fact, interpretation, behavior, or design constraint.
- `OPEN-QUESTION` — unresolved point that may block or alter work.
- `RISK` — known risk that has not yet become an error.

### Error types

- `ERROR-SPEC` — misunderstood user intent, specification, or acceptance criteria.
- `ERROR-REASONING` — mathematical, physical, logical, or pedagogical reasoning error.
- `ERROR-IMPLEMENTATION` — code, UI, content-data, or integration implementation error.
- `ERROR-PROCESS` — workflow violation such as executing before approval or mixing modes.
- `ERROR-QA` — missing/insufficient verification, missed regression, false PASS.
- `ERROR-PROVENANCE` — wrong source, stale branch, wrong canonical document, or lineage mistake.

A user correction is not disposable chat text. If it establishes that an assumption/action was wrong, record the appropriate finding.

A user confirmation is also not disposable chat text. If it establishes a stable fact/design constraint, record it as `CONFIRMED` and promote it when necessary.

## 10. VERIFICATION.md

Stores evidence that the Work satisfies its approved proposal.

Each verification uses an ID such as `V-001`.

Depending on scope, verification may include:

- mathematical/physical correctness
- pedagogical correctness
- content/reference integrity
- answer leakage checks
- figure/rendering checks
- typecheck / lint / unit tests
- build / E2E / browser / mobile QA
- repository governance validator

A failed check must be recorded. Do not erase failures after fixing them; append the later PASS result.

## 11. Approval gate

Before implementation, ask:

```text
Does an approved proposal exist for exactly this work?
                 │
          ┌──────┴──────┐
          │             │
         NO            YES
          │             │
          ▼             ▼
      investigate    execute inside
      + proposal     approved scope
          │
          ▼
      user approval
          │
          ▼
       APPROVED
```

### Proposal review loop

A proposal review is iterative.

```text
PROPOSED P-001
    ↓
USER REVIEW
    ├─ explicit approval of exact P-001
    │      ↓
    │   APPROVED
    │
    └─ correction / addition / condition / rejection
           ↓
      REVISE-PROPOSAL
           ↓
      create P-002
           ↓
      present full P-002
           ↓
          STOP
           ↓
      USER REVIEW
           ├─ explicit approval → APPROVED
           └─ more feedback → REVISE-PROPOSAL again
```

Rules:

- A review comment is never silently converted into a revised approved proposal.
- Do not rewrite P-001 so that earlier approval appears to cover P-002.
- A short reply such as “yes”, “そう”, or “OK” may count only when it directly answers a specific approval question about the exact current proposal and introduces no new change.
- If approval intent is ambiguous, ask and do not implement.
- The revised proposal must be shown before implementation.

### No repeated approval

Do not mechanically ask the user to approve the same unchanged proposal again in every chat.

Approval survives chat boundaries when the repository contains adequate evidence of:
- what was approved,
- its scope,
- and that the current action is inside that scope.

### When approval must be renewed

Return to `REVISE-PROPOSAL` when a material new decision is needed, especially:
- changed user-visible behavior,
- changed pedagogical structure,
- expanded destructive cleanup,
- schema/API contract change not covered by the proposal,
- replacement of the chosen technical approach,
- newly discovered conflict with higher authority.

## 12. Standard execution logic

```text
RECOVER
  ↓
IDENTIFY WORK
  ↓
RECONSTRUCT STATE
  ↓
CHECK APPROVAL
  ├─ no → ASSESS → PROPOSE → USER APPROVAL → APPROVED
  └─ yes ───────────────────────────────────────┘
  ↓
PLAN / TASKS
  ↓
IMPLEMENT
  ↓
LOG ACTIONS + FINDINGS
  ↓
VERIFY
  ├─ fail → record → FIX or REVISE-PROPOSAL
  └─ pass
  ↓
MEMORY CLOSE
  ↓
DONE
```

## 12A. User review handoff

When a Work reaches a user-reviewable stopping point, the handoff is incomplete until it includes at least one usable review link.

Link priority:
1. live/rendered app or preview URL;
2. Pull Request;
3. branch or exact GitHub location.

If the best link type is unavailable, state that limitation and provide the best available fallback.

This rule applies to:
- DONE correction work;
- VERIFYING work paused for user review;
- pilot/review gates before wider rollout.

A correction handoff must not end as prose-only when a usable review link exists.

## 13. Memory promotion

Work records are detailed local memory. Only durable information is promoted upward.

```text
Work record
   ├─ reusable mistake/rule ──→ memory/LESSONS/
   ├─ durable design choice ──→ memory/DECISIONS/
   ├─ project-current-state ──→ CURRENT_POSITION / PROGRESS
   ├─ dependency/state change ─→ MASTER_MATCH_GRAPH
   ├─ significant chronology ─→ CHANGELOG
   └─ ordinary local detail ──→ remains inside the Work
```

Do not promote every action to global memory.

## 14. What counts as a Decision vs Finding vs Lesson

- **Finding**: something learned in this concrete Work.
- **Decision**: a durable choice adopted for future implementation.
- **Lesson**: a reusable rule extracted from success/failure.
- **Action**: something actually performed.
- **Verification**: evidence that a requirement passes or fails.

## 15. Modification work

“修正” does not itself authorize implementation.

For a correction request:

```text
RECOVER
→ identify current behavior
→ determine what actually needs correction
→ check for an existing approved correction proposal
→ if absent: propose correction and wait
→ if user gives correction/advice: REVISE-PROPOSAL → show revised proposal → STOP
→ only after explicit approval of the revised proposal: fix only that approved scope
→ validate original symptom + regression
→ record error/confirmed findings
→ memory close
```

If the user has already approved the exact correction plan, do not ask again.

## 16. Record quality

Records must be detailed enough for a fresh agent to continue, but not become hidden reasoning dumps.

Prefer:
- observable facts,
- exact file/branch/path,
- proposal/approval state,
- actions taken,
- results,
- errors,
- evidence,
- next step.

Avoid:
- speculative internal monologue,
- untraceable “seems fixed” claims,
- rewriting old failures out of history.
