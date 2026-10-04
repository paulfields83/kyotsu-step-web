# Repository Governance Lessons

Updated: 2026-10-05

## L1 — A big README becomes stale

The old root docs were locally correct when written but eventually looked globally authoritative after the project expanded. Keep root routers short; place detailed canon at the scope where it applies.

## L2 — Filename does not equal authority

`完成版`, `v8`, `final`, newest timestamp, or oldest root location are not enough to select the canonical source. Authority must be declared.

## L3 — Cleanup must start with provenance

Deleting “old looking” files before tracing branches, source files, generated assets, and replacements can destroy the only copy of useful work.

## L4 — Branch count exaggerates the real problem

A branch may be hundreds of commits divergent while its final useful delta is small. Compare final trees and classify behavior before choosing cherry-pick/merge/delete.

## L5 — Preserve intent, not stale implementation

A newer branch can contain a valuable UI idea on top of an older backend. Port the intent onto the current technical base instead of merging the whole branch.

## L6 — Memory categories are different things

Current context, progress, lessons, decisions, specs, and history must not be merged into one giant “memory” document.

## L7 — Warnings should become errors after cleanup

Existing technical debt can begin as validator warnings. Once cleanup removes it, escalate the rule so the debt cannot silently return.
