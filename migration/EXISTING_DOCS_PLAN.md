# Existing Root / docs Migration Plan

Status: PLAN — NO FILES MOVED YET  
Updated: 2026-10-05

## Root

| Current | Target/action | Status |
|---|---|---|
| `README.md` | Rewrite as short human router to governance/navigation/subject/technical docs | REWRITE |
| `WORKFLOW.md` | Move original to `history/initial-app/WORKFLOW_2026-08.md`; current global workflow is `governance/CHANGE_PROTOCOL.md` | HISTORICIZE |
| `figure.zip` | provenance check, then likely `archive/deliverables/` | BLOCKED |
| `数学IA_教科書学習モード.zip` | provenance/reproducibility check, then `archive/deliverables/` or remove if fully reproducible and explicitly approved | BLOCKED |

## docs/

| Current | Target/action | Status |
|---|---|---|
| `docs/ARCHITECTURE.md` | extract still-current architecture → `technical/architecture/APP_ARCHITECTURE.md`; original snapshot → history | EXTRACT+HISTORY |
| `docs/CONTENT_GUIDE.md` | extract stable ID/revision/provenance/content rules → `technical/content/CONTENT_DATA_POLICY.md`; old bilingual/static assumptions → history | EXTRACT+HISTORY |
| `docs/DEPLOYMENT.md` | historical static-only deployment snapshot → history; write new current backend-aware deployment doc separately | HISTORICIZE+REWRITE |
| `docs/DESIGN_SYSTEM.md` | compare with current approved UI; surviving visual semantics → `technical/ui/DESIGN_SYSTEM.md` | REVIEW+PROMOTE |
| `docs/PRODUCT_REQUIREMENTS.md` | `history/initial-app/PRODUCT_REQUIREMENTS_2026-08.md` | HISTORY |
| `docs/QUESTION_SCHEMA.md` | old Common-Test schema → `technical/schemas/COMMON_TEST_QUESTION_SCHEMA.md` after refresh; original → history | EXTRACT+HISTORY |
| `docs/REQUIREMENTS_MATRIX.md` | `history/initial-app/REQUIREMENTS_MATRIX_2026-08.md` | HISTORY |
| `docs/TEST_PLAN.md` | extract active test gates → quality; old app-specific plan → history | EXTRACT+HISTORY |
| `docs/WORKLOG.md` | `history/initial-app/WORKLOG_2026-08.md` | HISTORY |
| `docs/backend-separation.md` | `history/migrations/backend-separation.md`; current backend boundary rewritten under technical | HISTORY |
| `docs/source-audit.md` | `history/source-audits/LOGIKA_AUDIT.md` | HISTORY |
| `docs/checkpoints/.gitkeep` | remove when history/checkpoints populated | REMOVE-LATER |
| `docs/checkpoints/phase-00-review.md` ... `phase-13-review.md` | `history/checkpoints/initial-app/` preserving filenames | HISTORY |

## Runtime/content directories

### `src/`, `backend/`, `public/`, `e2e/`

No bulk move in Repository OS v1.

### `backend/data/textbooks/**/source/*.docx`

Keep in place initially, but require a source manifest with:
- source artifact name
- role: canonical source / evidence / backup / generated
- revision
- produced-by
- related published unit
- replacement/supersession relation

A Word file named `完成版` or `v8` is not automatically canonical.

### figures / generated assets

Each figure family should eventually declare:
- source specification
- editable source
- generated output
- QA evidence
- runtime destination

## Migration execution order

M1 create target dirs/docs  
→ M2 write new technical canonical docs  
→ M3 add provenance manifests  
→ M4 update README/router links  
→ M5 move historical docs with git history preserved  
→ M6 update references  
→ M7 run validator  
→ M8 only then remove old duplicate paths

## Hard rule

Do not move a historical document first and promise to rewrite its useful content later.  
**Extract/promote current knowledge first; historicize second.**
