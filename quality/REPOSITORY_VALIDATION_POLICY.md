# Repository Validation Policy

Status: ACTIVE-DRAFT  
Updated: 2026-10-05

## Purpose

人間/Agentへの注意書きだけに頼らず、Repository OSの構造破壊と既知の技術負債を機械的に検出する。

Command:

```bash
node tools/repo-governance-check.mjs
```

## Severity model

### ERROR

新しい運用OSが成立しない構造破壊。CI導入後はmerge blockerにする。

Initial ERROR rules:
- required governance/navigation/memory files missing
- one of four mode specs missing
- mode spec has no valid Status
- mode spec lacks Purpose / Verification gate / Out of scope
- Match Graph lacks R00–R08
- CURRENT_POSITION lacks Current Node / Current Rule / Next Executable Work
- Constitution loses Canonical Truth principle

### WARNING

既存repositoryに既に存在する負債、またはmigration前に一括error化すると作業不能になる項目。

Initial WARNING rules:
- root binary ZIP without provenance classification
- learner-facing physics title architecture still exposing internal 1A–1G codes
- migration-era relative links requiring review
- Constitution amendment wording anomaly

Warnings must not be ignored forever。R05/R07で対象を減らし、0になったruleはERRORへ昇格する。

## Validation philosophy

1. **new invariants are errors immediately**
2. **legacy debt starts as warning**
3. **cleanup reduces the baseline**
4. **once debt reaches zero, regression becomes error**

これにより「古いrepoが汚いからvalidatorを入れられない」と「validatorはあるが全部warningで意味がない」の両方を避ける。

## Planned rules

R06-02:
- canonical document relative-link resolution
- ACTIVE/CANONICAL document must not depend on ARCHIVED/DEPRECATED as authority
- node registry ↔ node detail file consistency
- generated artifact provenance manifest
- no duplicate stable Node ID
- question dependency reference integrity

R06-03 after migration:
- learner-facing internal unit-code exposure = ERROR after Chapter 1 title migration
- root binary archive = ERROR
- stale root README authority text = ERROR
- canonical spec freshness metadata

## Gate to R07

R07 destructive cleanup cannot start until:
- structural validator reports 0 ERROR
- all WARNING types have owner/disposition
- warning count baseline is recorded
- cleanup plan states which warnings it will remove
