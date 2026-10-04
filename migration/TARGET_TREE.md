# Target Repository Tree — Juku Repository OS v1

Status: MIGRATION-TARGET  
Updated: 2026-10-05

目的は「全部を新しい場所へ移す」ことではなく、runtimeを壊さずに authority / memory / history の境界を明確にすること。

```text
/
├── AGENTS.md                  # AI router
├── README.md                  # human router
│
├── governance/               # project constitution and authority
│   ├── CONSTITUTION.md
│   ├── DOCUMENT_AUTHORITY.md
│   └── CHANGE_PROTOCOL.md
│
├── navigation/               # current state graph
│   ├── MASTER_MATCH_GRAPH.md
│   └── CURRENT_POSITION.md
│
├── memory/                   # durable project memory
│   ├── PROJECT_BRIEF.md
│   ├── ACTIVE_CONTEXT.md
│   ├── PROGRESS.md
│   ├── LESSONS/
│   └── DECISIONS/
│
├── subjects/                 # pedagogical canon
│   ├── mathematics/
│   │   ├── AGENTS.md
│   │   ├── MODE_MAP.md
│   │   ├── textbook/SPEC.md
│   │   └── practice/SPEC.md
│   └── physics/
│       ├── AGENTS.md
│       ├── textbook/SPEC.md
│       └── practice/SPEC.md
│
├── technical/                # current technical canon
│   ├── architecture/
│   ├── schemas/
│   ├── content/
│   ├── ui/
│   └── deployment/
│
├── quality/                  # QA gates and validation policy
│   ├── REPOSITORY_VALIDATION_POLICY.md
│   ├── CHECKLISTS/
│   └── KNOWN_PROBLEMS.md
│
├── work/                     # feature/spec work, temporary but structured
│   ├── active/
│   └── completed/
│
├── migration/                # current cleanup migration plan
│
├── history/                  # historical evidence, no current authority
│   ├── initial-app/
│   ├── checkpoints/
│   ├── migrations/
│   └── source-audits/
│
├── archive/                  # deprecated/deliverable binaries after provenance
│   ├── deprecated/
│   └── deliverables/
│
├── tools/                    # project/repository validators
├── scripts/                  # product/content build scripts
│
├── src/                      # runtime frontend — keep stable paths
├── backend/                  # runtime backend + curriculum data — keep stable paths
├── public/                   # runtime public assets
├── e2e/                      # runtime E2E
└── package/tool config       # package.json, vite, tsconfig, etc.
```

## Why runtime paths stay

`backend/data/textbooks/` has hundreds of files and many code references. Moving the content tree merely to make the repository look clean would create path churn and deployment risk.

Therefore v1 cleanup:
- separates governance/docs/history first
- leaves runtime/content paths in place
- adds provenance/manifest requirements around source/generated assets
- only moves runtime data when a concrete architecture benefit exists

## Canonical boundaries

- governance answers **what rules cannot be silently changed**
- navigation answers **where we are now**
- memory answers **what we know / learned**
- subjects answers **how each educational mode works**
- technical answers **how the software/data system works**
- quality answers **how completion is verified**
- work answers **what current feature is being changed**
- history answers **what happened before**
- archive stores **non-authoritative old/deliverable artifacts**

A new Agent should never need to infer these roles from filenames.
