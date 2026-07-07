# XL Chess — Hero Section (Stage 2 Assessment)

A redesigned hero section for a modern chess platform. The centerpiece is a live,
move-by-move replay of **the Evergreen Game** (Anderssen vs. Kieseritzky, 1852) — a
real, celebrated attacking game rendered on an interactive board, rather than a
decorative animation with no meaning behind it.

## Approach chosen

**Option 3 – Redesign.** Rather than recreating xlchess.com's existing hero, this
treats the brief as: *what's the single most characteristic thing in a chess
platform's world?* The answer is a game itself — the tension of a real position
changing move by move. The board is not static art; it plays.

## Tech stack

- **Vite + React + TypeScript** — fast dev loop, typed component boundaries
- **Tailwind CSS v4** — theme tokens defined once via `@theme` in `src/index.css`,
  consumed as ordinary utility classes (`bg-board-dark`, `text-accent-soft`, etc.)
- **Framer Motion** — spring-based piece movement, entrance choreography, and a
  `useReducedMotion` hook that removes motion for users who ask for it
- **chess.js** — parses the Evergreen Game's PGN and provides verified, verbose
  move data (SAN, from/to squares, capture/castle/en-passant/promotion flags),
  so board state is always rules-correct rather than hand-authored

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

No environment variables or backend are required — this is a static hero section.

## Project structure

```
src/
  components/
    ChessBoard.tsx       # renders 64 squares + animated piece layer
    MoveTicker.tsx        # scrolling SAN notation, live region for screen readers
    PlaybackControls.tsx  # restart / prev / play-pause / next
    Hero.tsx               # copy, CTAs, composes the board experience
  hooks/
    useGameReplay.ts      # ply state, autoplay timer, playback API
  lib/
    pieceTracker.ts        # assigns each piece a stable id and replays chess.js
                            # moves onto it (handles captures, castling, en
                            # passant, promotion) so pieces can be animated
                            # individually instead of re-rendering the whole board
  data/
    evergreenGame.ts       # the game's PGN and display metadata
```

Each piece of UI is a single-responsibility component; the "chess logic" (rules,
move application) is isolated in `lib/` and `hooks/`, away from rendering, so
either side can be tested or swapped independently.

## Design decisions

- **Palette**: warm ivory/parchment and walnut-brown board tones instead of a
  generic dark-mode-plus-neon-accent look, evoking a physical wooden board rather
  than a generic "tech" surface.
- **Type**: Fraunces (display) for a serif with real editorial weight, paired
  with Inter (body copy) and IBM Plex Mono for anything numeric or notational
  (move list, stats, ply counter) — mirroring how chess notation actually reads.
- **Signature element**: the replaying board itself, with a synced, scrollable
  move ticker and transport controls (restart / step / play-pause), plus
  keyboard shortcuts (←/→ to step, Space to play/pause).
- **Motion**: one orchestrated entrance sequence for the copy, then the board's
  own move-by-move animation as the ongoing motion — deliberately not layered
  with extra ambient effects.

## Accessibility

- The board is exposed as a single `role="img"` with a descriptive, ply-aware
  `aria-label` (screen reader users get the position summary, not 64 nested
  elements to tab through).
- Move changes are announced via a visually-hidden `aria-live="polite"` region.
- All playback controls are real `<button>`s with `aria-label`s and visible
  focus rings (`:focus-visible`), and are fully keyboard-operable.
- `prefers-reduced-motion` is respected both globally (transition durations
  collapse) and specifically in the board (`useReducedMotion` disables the
  spring animation for piece movement).
- Text and background combinations were chosen to keep contrast comfortable
  against the dark ink background.

## Responsiveness

Single-column stack on mobile (copy above the board), side-by-side from `lg`
breakpoint up. The headline uses a `clamp()`-based fluid size instead of fixed
breakpoint jumps, and the board is percentage-based (`12.5%` per square) so it
scales continuously rather than snapping between fixed sizes.

## Performance

- Board state for every ply is precomputed once via `useMemo`, so stepping
  through the game is just an array index change, not a recomputation.
- Only 12 unique glyph/color combinations are rendered per frame (max 32
  pieces), with Framer Motion animating just `top`/`left` — no layout thrashing.
- Fonts are loaded with `preconnect` hints; the production bundle is a single
  JS/CSS pair with no runtime dependency on a backend.

## Assumptions

- No real xlchess.com backend, auth, or game data was available, so "Play now"
  and "Explore lessons" are non-destination anchors — in production these would
  route to the actual product surfaces.
- The brief's marking scheme rewards engineering judgement over pixel-parity
  with the existing site, which is why Option 3 (redesign) was chosen over
  Option 1.

## Trade-offs

- Chess pieces are rendered as styled Unicode glyphs rather than custom SVG
  artwork. This keeps the bundle tiny and the code simple, at some cost to
  visual craft compared to bespoke piece art.
- Only the hero section is built, per the brief — there's no header/nav or
  footer, since those weren't part of the assessment scope.
- Autoplay is a fixed interval rather than adapting pace to move "importance"
  (e.g. slowing down for the final mating sequence), which would need move
  annotation data.

## What I'd improve with more time

- Custom-drawn piece artwork (or an SVG piece set) instead of Unicode glyphs,
  for sharper rendering at all sizes and pixel-perfect alignment.
- A "checkmate" moment treatment — a subtle highlight/glow on the final
  position and the mating piece.
- Letting a visitor drag the ply slider directly, and exposing a couple of
  alternate famous games to replay.
- Real analytics-informed copy testing for the headline and CTAs.
- Automated accessibility testing (axe) and visual regression snapshots in CI.
