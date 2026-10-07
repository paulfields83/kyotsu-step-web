# Work Records

Status: CANONICAL
Updated: 2026-10-07

Concrete project work is tracked as a **Work** according to `governance/WORK_SYSTEM.md`.

## New Work layout

```text
work/items/<WORK-ID>-<short-name>/
├── WORK.md
├── PROPOSAL.md
├── ACTION_LOG.md
├── FINDINGS.md
└── VERIFICATION.md
```

Use templates under `work/templates/`.

## Rules

- one clear objective per Work ID
- status and approval state must be explicit
- do not execute an unapproved material proposal
- record actual actions and locations
- record both errors and confirmed facts
- verification is required before DONE
- promote only durable decisions/lessons/current-state changes to global memory

## Legacy active work

Existing files under `work/active/` are retained. Migrate them only when actively resumed or when migration itself is approved; do not delete them merely to make the tree uniform.
