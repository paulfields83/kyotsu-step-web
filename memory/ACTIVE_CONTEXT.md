# ACTIVE CONTEXT

Updated: 2026-10-05

## Current Focus

Repository OS v1 の設計段階から、migration/validationを実行可能にする段階へ移った。

## Completed in this cleanup branch

- main/branch inventory
- document authority initial classification
- Constitution / authority / change protocol
- Master Match Graph / Current Position
- four mode canonical-candidate specs
- full 32-path `front-ui--test` disposition
- target repository tree
- legacy root/docs migration plan
- structural validator + validation policy
- ADR / lessons / changelog memory separation

## Active Decisions

- destructive cleanup is still frozen.
- runtime paths stay stable in v1; governance/docs/history are cleaned first.
- Math Practice must model cross-question dependencies.
- Physics Textbook old `1A〜1G/1D` identifiers are not chapter authority.
- Practice frontend is salvaged selectively from `front-ui--test`.
- main backend/deployment is the technical base.
- warnings become errors after legacy debt is removed.

## Open Risks

- root ZIP provenance still unknown.
- some Word/source artifacts may be newer than main implementation and need manifest classification.
- four mode specs are CANONICAL-CANDIDATE, not yet ratified CANONICAL.
- current technical architecture/deployment docs still need rewrite from live code.
- validator has syntax-check proof but has not yet been executed against a full repository checkout in this tool environment.
- Practice frontend salvage has not yet been applied.

## Next

1. extract current technical canon from live code.
2. rewrite short human README router.
3. create history/archive structure without deleting originals.
4. provenance classify root binaries/source Word families.
5. prepare fresh-agent recovery test.
