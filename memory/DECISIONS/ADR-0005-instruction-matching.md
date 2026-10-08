# ADR-0005 — Similar GitHub instructions require explicit user mapping

Status: ACCEPTED
Date: 2026-10-08

## Context

A user's natural-language GitHub instruction may resemble a registered command without exactly matching its canonical phrase. Treating similarity as equivalence can silently expand authority.

## Decision

Use three matching states:

- EXACT — process as the registered command.
- SIMILAR — show the candidate command and its meaning, then ask the user whether to treat the instruction as that command. Do not execute before confirmation.
- UNKNOWN — do not start GitHub changes. If the missing command is important, stop normal work and prioritize an instruction-dictionary correction proposal.

Aliases require explicit user approval.

## Consequence

The agent may recognize similarity, but cannot convert that recognition into execution authority without user confirmation.
