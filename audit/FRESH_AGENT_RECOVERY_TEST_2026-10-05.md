# Fresh-Agent Recovery Test — 2026-10-05

Status: **PASS**

## Test premise

Pretend an Agent has no chat history and begins only from repository entry files.

Required reading route:

```text
README.md / AGENTS.md
→ governance/CONSTITUTION.md
→ navigation/CURRENT_POSITION.md
→ navigation/MASTER_MATCH_GRAPH.md
→ relevant subject/mode spec
```

## Questions a fresh Agent must answer

| Question | Discoverable from | Result |
|---|---|---|
| What is this project? | README / PROJECT_BRIEF | PASS |
| Which rules outrank historical docs? | CONSTITUTION / DOCUMENT_AUTHORITY | PASS |
| What is the current working branch/node? | CURRENT_POSITION | PASS |
| May destructive cleanup happen broadly now? | CURRENT_POSITION | PASS |
| What is the correct cleanup order? | CHANGE_PROTOCOL / migration plan | PASS |
| Which four educational modes have separate specs? | README / Match Graph / subjects | PASS |
| Should Math Textbook and Math Practice rules be mixed? | Mathematics AGENTS / MODE_MAP | PASS |
| Does Math Practice need cross-question dependencies? | Math Practice SPEC / active work item | PASS |
| What should happen to front-ui--test? | CURRENT_POSITION / branch audit / ADR-0002 | PASS |
| Are internal Physics 1A–1G IDs deleted? | Physics Chapter 1 architecture | PASS — no, preserve internally |
| What are Chapter 1 learner titles? | Physics Chapter 1 architecture | PASS |
| Where are old docs kept? | README / migration / history | PASS |
| Are root ZIPs canonical sources? | archive provenance docs | PASS — no |
| What work is next? | CURRENT_POSITION | PASS |

## Failure modes checked

A fresh Agent should not conclude:
- old root `WORKFLOW.md` is current global workflow
- old static-only `docs/DEPLOYMENT.md` is current
- `front-ui--test` can be merged wholesale
- `1d-acceleration` path should be renamed/deleted because learner titles changed
- a `完成版` Word filename automatically outranks current mode specs

The new routing/authority documents explicitly prevent these conclusions.

## Remaining limitation

This recovery test validates repository navigation and authority recovery, not full application behavior.

Final R08 still requires:
- post-cleanup governance CI
- application build/test/E2E for changes that affect runtime
- branch-salvage closure or preservation decision
