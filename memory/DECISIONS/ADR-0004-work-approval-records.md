# ADR-0004 — Work records require explicit approval state and durable evidence

Status: ACCEPTED
Date: 2026-10-07

## Context

Repository OS v1 preserves project authority and current state, but concrete work can still lose important local history across chats: what proposal was approved, which files were touched, which assumptions were wrong, which facts were confirmed, and what verification actually ran.

The initial `憲法から` command also allowed a path from strategy to execution without an explicit approval-state gate.

## Decision

Adopt `governance/WORK_SYSTEM.md`.

Every new substantial Work uses a stable Work ID and five records:

- WORK
- PROPOSAL
- ACTION_LOG
- FINDINGS
- VERIFICATION

Implementation of a material proposal requires explicit user approval. An unchanged approved proposal may continue across chats without repeated approval.

Material deviation returns the Work to `REVISE-PROPOSAL`.

## Consequences

- new chats can recover detailed task state from the repository
- user corrections become typed findings rather than disposable chat text
- confirmed facts/choices are preserved too
- global memory receives only durable promoted information
- recording overhead increases slightly, so local logs must remain concise and evidence-oriented
