# Frontend integration boundary

The next frontend should treat the existing learning logic as a stable service layer instead of re-implementing it in UI components.

## Reuse these interfaces

- `src/repositories/textbookRepository.ts`
  - list published textbook units
  - load one textbook unit
  - submit textbook answers
- `src/stores/useAppStore.ts`
  - learning sessions and attempts
  - textbook progress
  - simulation attempts
  - user settings
- `src/domain/`
  - question, textbook, analytics, scoring and progress rules

## Backend contract

Set:

`VITE_API_BASE_URL=https://kyotsu-step-web.onrender.com`

The frontend should call the repository layer rather than constructing textbook API URLs in page components.

Current textbook answer behavior:

- correct submission -> `correct: true, resolved: true`
- wrong submission -> `correct: false, resolved: true, correctAnswer: ...`
- public textbook payloads do not include private answer keys

## Integration rule

A replacement UI may freely replace page/layout components, but should keep repository/store/domain contracts intact. This allows the engineering UI to be swapped in without changing backend data, answer checking, saved progress, analytics, mistakes, history or simulation logic.
