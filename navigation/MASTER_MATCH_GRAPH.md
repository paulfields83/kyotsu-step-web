# MASTER MATCH GRAPH

Status: DRAFT v1  
Updated: 2026-10-05

## Repository OS / Cleanup

```text
[R00 INVENTORY] ──▶ [R01 AUTHORITY MAP] ──▶ [R02 REPOSITORY OS v1]
      │                    │                       │
      │                    │                       ├──▶ [R03 MODE CANON]
      │                    │                       │       ├─ MATH-TEXT
      │                    │                       │       ├─ MATH-PRACTICE
      │                    │                       │       ├─ PHYS-TEXT
      │                    │                       │       └─ PHYS-PRACTICE
      │                    │                       │
      │                    │                       ├──▶ [R04 BRANCH SALVAGE]
      │                    │                       │
      │                    │                       ├──▶ [R05 DOC MIGRATION]
      │                    │                       │
      │                    │                       ├──▶ [R06 VALIDATORS]
      │                    │                       │
      │                    │                       └──▶ [R07 CLEANUP APPLY]
      │                    │                               │
      └────────────────────┴───────────────────────────────┘
                                                              ▼
                                                        [R08 FINAL AUDIT]
```

## Node Registry

### R00 — INVENTORY
Status: IN_PROGRESS  
Input: repository tree, branches, recent commits  
Output: complete file/branch inventory and risk list  
Verification: no known branch or top-level asset omitted  
Next: R01

### R01 — AUTHORITY MAP
Status: IN_PROGRESS  
Depends On: R00  
Output: every control document classified as CANONICAL / ACTIVE / HISTORICAL / DEPRECATED / ARCHIVED / GENERATED  
Verification: conflicts have one selected authority or explicit BLOCKED status  
Next: R02

### R02 — REPOSITORY OS v1
Status: ACTIVE  
Depends On: R00, R01(partial)  
Output: Constitution, Agent router, change protocol, current position, memory split, navigation  
Verification: a fresh Agent can determine what to read, what not to touch, and next executable node  
Next: R03-R06

### R03 — MODE CANON
Status: PLANNED  
Output: canonical specs for four existing mode families  
Rule: each mode owns its pedagogy/content rules; shared rules are factored upward only when genuinely common.

### R04 — BRANCH SALVAGE
Status: BLOCKED-PENDING-AUDIT  
Focus: especially `front-ui--test` unique 127 commits  
Output: keep/merge/cherry-pick/archive decision per unique workstream  
Hard rule: no branch deletion before salvage report.

### R05 — DOC MIGRATION
Status: PLANNED  
Output: old root/docs files reclassified and moved/rewritten without losing provenance.

### R06 — VALIDATORS
Status: PLANNED  
Examples:
- broken canonical links
- missing node files
- active node without next step
- DEPRECATED reference from active spec
- mode-cross-contamination
- stale naming such as retired section IDs
- generated artifact missing source provenance

### R07 — CLEANUP APPLY
Status: NOT READY  
Allowed only after R00-R06 gates.

### R08 — FINAL AUDIT
Status: NOT READY  
Goal: fresh-chat recovery test + repository consistency test.

## Subject/Mode Map

```text
                     [COMMON EDUCATION PRINCIPLES]
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
             [MATH]                         [PHYSICS]
          ┌─────┴─────┐                  ┌─────┴─────┐
          ▼           ▼                  ▼           ▼
     [TEXTBOOK]   [PRACTICE]        [TEXTBOOK]   [PRACTICE]
          │           │                  │           │
       SPEC/QA      SPEC/QA            SPEC/QA      SPEC/QA
```

モード間でルールを移植するときは、共通原則へ昇格できるかを先に検証する。
