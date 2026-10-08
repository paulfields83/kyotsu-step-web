# ADR-0006 — Proposal Review Feedback Is Not Approval

Status: ACCEPTED
Date: 2026-10-08

## Context

A user may respond to a proposal with positive wording while also adding corrections, conditions, or changes. Treating that feedback as approval silently expands authority.

## Decision

Adopt the invariant:

**REVIEW-FEEDBACK ≠ APPROVAL**

When user feedback materially changes a proposal:

1. move the Work to `REVISE-PROPOSAL`;
2. create a new proposal revision / ID;
3. preserve the prior proposal history;
4. present the full revised proposal to the user;
5. stop;
6. continue only after explicit approval of that exact revision.

A short affirmative may count only when it directly answers a specific approval question about the exact proposal and adds no new changes.

## Consequences

- review and approval are separate gates;
- agents cannot infer approval for an unshown revision;
- repeated review cycles are allowed until the exact proposal is approved.
