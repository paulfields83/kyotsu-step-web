# Physics Textbook — Chapter 1 Information Architecture

Status: CANONICAL  
Updated: 2026-10-05  
Provenance: latest Chapter 1 handoff dated 2026-10-02

## Core rule

**Learner-facing titles and internal stable IDs are different layers.**

Internal 1A–1G identity is preserved for:
- URL / routing
- progress
- tests
- provenance
- migration continuity

Learner UI must not expose 7 major cards merely because 7 internal units exist.

## Learner-facing Chapter 1 structure

Chapter 1 shows **3 major chunks**.

### 1. 運動を表す

Internal units:
- 1A — 変位と速度
- 1B — 速度の合成と分解
- 1C — 相対速度

Concept flow:

```text
位置
→ 変位
→ 速度
→ 合成・分解
→ 相対速度
```

### 2. 速度の変化

Internal units:
- 1D — 加速度
- 1E — 水平投射
- 1F — 斜方投射

Concept flow:

```text
加速度
→ 等加速度運動
→ 水平投射
→ 斜方投射
```

### 3. 力と運動

Internal unit:
- 1G — 重力加速度・空気抵抗・終端速度

Concept flow:

```text
重力
→ 空気抵抗
→ 終端速度
```

## UI contract

Setup:
- show 3 chunk cards, not 7 unit cards

Unit page:
- H1 = learner-facing chunk title
- current internal unit title may appear only as a smaller current-topic label
- do not make `1A`, `1B`, `1D`, etc. the major learner-facing heading

Completion:
- do not force the learner back to setup between every internal unit
- show bridge sentence
- continue to the next internal unit

## Bridge sentences

### 1A → 1B
速度には向きがある。次は複数の運動をベクトルとして組み合わせる。

### 1B → 1C
速度をベクトルとして扱えた。次は「誰から見た速度か」。

### 1C → 1D
ここまでは速度をどう表すか。次は速度そのものが時間とともに変わる運動。

### 1D → 1E
加速度・等加速度式を作った。次は平面運動へ使う。

### 1E → 1F
水平投射から斜方投射へ同じ考えを拡張する。

### 1F → 1G
ここまでは加速度を使って運動を求めた。最後に加速度を生み出す力へさかのぼる。

## Important distinction

The following are **not bugs**:
- internal path containing `1d-acceleration`
- stable internal 1D identity used by route/progress/test/provenance

The following **are bugs**:
- setup presenting “1D 加速度” as one of seven major learner-facing cards
- H1 exposing internal code as the major title
- prose saying “1Dで導いた” or “1Dの式” to the learner when a natural conceptual reference should be used
- deleting/renaming stable IDs without migration just to simplify display titles

## Migration implication

Do not rename `backend/data/textbooks/physics/1d-acceleration` merely to satisfy the title redesign.

Instead:
1. preserve internal identity
2. implement a learner-facing chunk map
3. update setup/navigation
4. replace visible internal-code references in prose
5. preserve progress/test migration compatibility

## Repository gap

At the 2026-10-05 main audit, the latest three-chunk architecture was not found as a dedicated runtime architecture file on `main`.

Therefore this design is a **canonical candidate requirement not yet fully represented by current main implementation**.
