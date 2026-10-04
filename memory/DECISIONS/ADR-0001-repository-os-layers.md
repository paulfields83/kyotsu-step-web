# ADR-0001 — Repository OS uses separate authority layers

Status: ACCEPTED-FOR-DRAFT  
Date: 2026-10-05

## Context

The repository mixed runtime code, curriculum data, old planning documents, worklogs, Word sources, ZIP deliverables, and current educational rules. New chats had to infer which file was current.

## Decision

Separate:
- governance
- navigation
- memory
- subject/mode canon
- technical canon
- quality
- active work
- history
- archive

Root AGENTS is a router, not an encyclopedia. Context is loaded progressively.

## Consequence

A file's location and status communicate its authority. Existing `docs/` content must be migrated/classified rather than treated as one authority layer.
