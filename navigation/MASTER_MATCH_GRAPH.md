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
Status: PASS-INITIAL  
Input: repository tree, branches, recent commits  
Output: file/branch inventory and risk list  
Evidence: `audit/REPOSITORY_AUDIT_2026-10-05.md`  
Remaining: binary contents and external/chat-only latest deliverables still need provenance check.

### R01 — AUTHORITY MAP
Status: PASS-INITIAL  
Depends On: R00  
Output: initial classification of current control documents  
Evidence: `audit/DOCUMENT_AUTHORITY_CLASSIFICATION.md`  
Remaining: promote mode-specific candidates only after R03 reconciliation.

### R02 — REPOSITORY OS v1
Status: ACTIVE  
Depends On: R00, R01  
Output: Constitution, Agent router, change protocol, current position, memory split, navigation  
Verification pending: fresh-agent recovery test after R03-R06.

### R03 — MODE CANON
Status: NEXT  
Output: canonical specs for four existing mode families  
Rule: each mode owns its pedagogy/content rules; shared rules are factored upward only when genuinely common.

### R04 — BRANCH SALVAGE
Status: AUDITED-PENDING-DISPOSITION  
Focus: `front-ui--test`  
Evidence: `audit/BRANCH_SALVAGE_FRONT_UI_TEST.md`  
Finding: final tree delta = 10 branch-only + 22 modified paths. Practice frontend should be ported selectively; backend branch state must not replace main.

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
Allowed only after R03-R06 gates.

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
