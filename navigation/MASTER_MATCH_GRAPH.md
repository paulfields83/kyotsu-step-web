# MASTER MATCH GRAPH

Status: DRAFT v1  
Updated: 2026-10-05

## Repository OS / Cleanup

```text
[R00 INVENTORY] ──▶ [R01 AUTHORITY MAP] ──▶ [R02 REPOSITORY OS v1]
      │                    │                       │
      │                    │                       ├──▶ [R03 MODE CANON] ── PASS-CANDIDATE
      │                    │                       │       ├─ MATH-TEXT
      │                    │                       │       ├─ MATH-PRACTICE
      │                    │                       │       ├─ PHYS-TEXT
      │                    │                       │       └─ PHYS-PRACTICE
      │                    │                       │
      │                    │                       ├──▶ [R04 BRANCH SALVAGE] ── DISPOSITIONED
      │                    │                       │
      │                    │                       ├──▶ [R05 DOC MIGRATION]
      │                    │                       │
      │                    │                       ├──▶ [R06 VALIDATORS] ── ACTIVE
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
Evidence: `audit/REPOSITORY_AUDIT_2026-10-05.md`  
Remaining: binary provenance and any chat-only deliverables.

### R01 — AUTHORITY MAP
Status: PASS-INITIAL  
Evidence: `audit/DOCUMENT_AUTHORITY_CLASSIFICATION.md`  
Remaining: final promotion after migration.

### R02 — REPOSITORY OS v1
Status: ACTIVE  
Output: Constitution, Agent router, authority model, change protocol, current position, memory split, navigation.  
Verification pending: fresh-agent recovery test after R05-R06.

### R03 — MODE CANON
Status: PASS-CANDIDATE  
Canonical candidates created:
- `subjects/mathematics/textbook/SPEC.md`
- `subjects/mathematics/practice/SPEC.md`
- `subjects/physics/textbook/SPEC.md`
- `subjects/physics/practice/SPEC.md`

Promotion from CANONICAL-CANDIDATE to CANONICAL occurs after migration/conflict audit and explicit acceptance.

### R04 — BRANCH SALVAGE
Status: DISPOSITIONED-PENDING-PORT  
Evidence:
- `audit/BRANCH_SALVAGE_FRONT_UI_TEST.md`
- `audit/BRANCH_32_PATH_DISPOSITION.md`

Finding: final tree delta = 10 branch-only + 22 modified paths. Practice frontend is selective salvage; backend wholesale merge is rejected. Branch deletion remains blocked until salvage/rejection decisions are actually applied.

### R05 — DOC MIGRATION
Status: PLANNED  
Output: old root/docs files reclassified/moved/rewritten without losing provenance.

### R06 — VALIDATORS
Status: ACTIVE  
Initial validators:
- required governance/navigation/spec files
- mode spec status/sections
- Match Graph node presence
- active-current-position contract
- root binary warnings
- retired identifier warnings
- later: broken canonical links / stale references / generated provenance

### R07 — CLEANUP APPLY
Status: NOT READY  
Gate: R05 and R06 must pass; R04 high-value salvage must be protected.

### R08 — FINAL AUDIT
Status: NOT READY  
Goal: fresh-agent recovery test + repository consistency test + build/test/E2E after migration.

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
