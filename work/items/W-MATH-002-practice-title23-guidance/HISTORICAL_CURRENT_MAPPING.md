# Historical → Current Mapping — Section 2 / 3 Practice

Status: REVIEWED-FOR-PILOT
Date: 2026-10-10
Authority: W-MATH-002 / P-002

## Mother patterns

### Old q01 — 集合の演算を順序よく整理する

Reusable pattern:
1. establish comparable set representations;
2. apply one operation at a time;
3. preserve intermediate results;
4. make the dependency between steps explicit;
5. substitute correct results before the next dependent step.

Core node fields:
- dependsOn
- basis
- purpose
- operation
- content
- blankIds

### Old q02 — 領域の情報から集合を復元する

Reusable pattern:
1. identify the four Venn regions;
2. recover the missing region from U;
3. reconstruct larger sets from regions;
4. reuse the reconstructed state for later questions;
5. finish with a consistency check.

## Seven-question mapping

| Current question | Current task | Closest old pattern | Reusable reasoning move | Current missing bridge | New node actually needed? | Figure? | Leakage risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Q95 | A∩B / A∪B over list, interval, divisor, generated sets | q01 direct | normalize representation → intersection/union → reuse same normalized sets | source miniGuide states rule, but does not expose when representation must first be normalized; interval endpoint check is compressed | YES for interval endpoint check; otherwise split only where representation conversion is nontrivial | No | Low |
| Q96 | 3-set intersection and union | q01 extension | establish A/B/C → compute intermediate 2-set result → extend to third set | learner can jump directly to final 3-set answer; reuse of intermediate result is invisible | YES: one intermediate 2-set node before each 3-set result | No | Low |
| Q97 | complements and compound operations | q01 complement branch | fix U → derive complement → apply expression structure → reuse complements | source miniGuide says “U基準 / 括弧内 first” but does not show which computed complement feeds which later expression | YES for parenthesized/composite expressions; no new infrastructure | No | Medium: De Morgan check must not reveal answers early |
| Q99 | 3 sets + complements + parentheses | q01 operation-order extension | identify expression tree → compute smallest subexpression → preserve result → next operation | current miniGuide says 「左から小さく」 although true dependency is defined by complement/parenthesis scope | YES: explicit subexpression nodes, especially (A∪C) and B̄ before final ∩ | No | Medium |
| Q100 | infer parameter from A∩B then build A∪B | q01 “make comparison state explicit”, adapted inverse | convert target intersection into membership constraints → candidate generation → candidate test → reject extras | source miniGuide names checks but compresses candidate generation and rejection into one sentence | YES: candidate-generation node + candidate-validation node | No | High: keyPoint/answer cannot appear before rejection |
| A-8 | infer parameter with absolute value and reject invalid candidate | Q100 adaptation | generate two candidates → evaluate B/intersection → reject extra common element → accept → union | source miniGuide says to narrow candidates, but branch-and-reject path is not visible | YES: explicit branch/check/reject nodes | No | High: a=5 rejection reason must not be pre-revealed |
| Q98 | reconstruct from Venn regions | q02 direct | identify four regions → compute missing region from U → reconstruct requested sets | current miniGuide already states the four-region idea, but the state transition from known regions to missing region is not staged | YES: region-state node + missing-region node before requested outputs | YES, optional but useful at the region-state node | Very high: B-only region must remain unknown until solved |

## Pilot decision

Pilot questions:
- Q95 — direct q01 descendant
- Q98 — direct q02 descendant

Reason:
- they test the historical mother patterns with the least conceptual distortion;
- if these two cannot reproduce the old quality using the current schema, broader rollout should stop.

## Pilot implementation constraints

### Q95

Minimum visible chain:
1. read the current subproblem;
2. if representations differ, normalize them;
3. derive A∩B from “both”;
4. derive A∪B from “at least one”;
5. for interval case only, check endpoint inclusion explicitly.

Do not introduce generic concept teaching.

### Q98

Minimum visible chain:
1. name the four region roles;
2. place the three known regions;
3. derive the missing B-only region by subtracting known regions from U;
4. reuse the resulting region state to obtain (1) A∪B, (2) B̄, (3) Ā∩B.

The figure, if used, must show the unknown region as unknown until Step 3 resolves.

## Review conclusion

The old q01/q02 architecture is sufficient as the pilot mother pattern.

No new schema field is justified before attempting Q95/Q98 with the existing:
- dependsOn
- basis
- purpose
- operation
- content
- blankIds

If the pilot cannot express a real dependency with those fields, stop and propose the minimum schema change separately.
