# Physics Chapter 1 Figure Provenance

Status: PROVENANCE-RECORDED  
Updated: 2026-10-05

## Source bundle

Original uploaded bundle:
- root `figure.zip`
- blob SHA `b2cb3ca846380078d6c3f4772a90e02dff39a6a5`
- introduced in `df34fe68` — `Add uploaded physics figures and lockfile`

The same commit extracted 17 PNG blobs into `tmp_figures/`.

## Promotion commit

Commit:
- `79be5372`
- message: `Place physics chapter 1 figures in textbook lessons`

This commit renamed the extracted image blobs into active asset paths. Git reported them as renames with the same blob SHA.

## Mapped assets

- `tmp_figures/1.png` → `public/assets/physics/textbook/a-displacement/position-vector.png`
- `tmp_figures/2 (2).png` → `public/assets/physics/textbook/a-displacement/tangent-velocity.png`
- `tmp_figures/3 (2).png` → `public/assets/physics/textbook/a-displacement/curve-abc.png`
- `tmp_figures/4.png` → `public/assets/physics/textbook/a-displacement/coordinate.png`
- `tmp_figures/5.png` → `backend/data/textbooks/physics/1b-velocity-composition-decomposition/assets/velocity-composition.png`
- `tmp_figures/6.png` → `backend/data/textbooks/physics/1b-velocity-composition-decomposition/assets/velocity-components.png`
- `tmp_figures/7.png` → `backend/data/textbooks/physics/1c-relative-velocity/assets/relative-velocity-cars.png`
- `tmp_figures/8.png` → `backend/data/textbooks/physics/1c-relative-velocity/assets/relative-velocity-rain.png`
- `tmp_figures/9.png` → `backend/data/textbooks/physics/1d-acceleration/assets/acceleration-motion.png`
- `tmp_figures/10.png` → `backend/data/textbooks/physics/1d-acceleration/assets/acceleration-delta-v.png`
- `tmp_figures/11.png` → `backend/data/textbooks/physics/1e-horizontal-projection/assets/horizontal-projection-strobe.png`
- `tmp_figures/12.png` → `backend/data/textbooks/physics/1e-horizontal-projection/assets/horizontal-projection-components.png`
- `tmp_figures/13.png` → `backend/data/textbooks/physics/1f-projectile-motion/assets/projectile-trajectory.png`
- `tmp_figures/14.png` → `backend/data/textbooks/physics/1f-projectile-motion/assets/projectile-components.png`
- `tmp_figures/15.png` → `backend/data/textbooks/physics/1g-gravity-drag-terminal-velocity/assets/gravity-drag-freefall.png`
- `tmp_figures/16.png` → `backend/data/textbooks/physics/1g-gravity-drag-terminal-velocity/assets/gravity-drag-forces.png`
- `tmp_figures/17.png` → `backend/data/textbooks/physics/1g-gravity-drag-terminal-velocity/assets/terminal-velocity-graph.png`

## Consequence

The root ZIP is not required to locate the promoted Chapter 1 figure files.

The active asset paths are the runtime copies.  
The ZIP is retained only as a historical delivery/recovery archive.

## Important exception

This provenance statement does **not** approve the current visible section identifiers such as `1d-acceleration`. Asset provenance and chapter-structure authority are separate questions.
