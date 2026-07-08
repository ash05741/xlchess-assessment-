import { motion, useReducedMotion } from 'framer-motion';
import type { TrackedPiece } from '../lib/pieceTracker';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const GLYPHS: Record<string, string> = {
  'w-p': '♙',
  'w-n': '♘',
  'w-b': '♗',
  'w-r': '♖',
  'w-q': '♕',
  'w-k': '♔',
  'b-p': '♟',
  'b-n': '♞',
  'b-b': '♝',
  'b-r': '♜',
  'b-q': '♛',
  'b-k': '♚',
};

function squareToPercent(square: string) {
  const file = FILES.indexOf(square[0]);
  const rank = Number(square[1]);
  return {
    left: file * 12.5,
    top: (8 - rank) * 12.5,
  };
}

interface ChessBoardProps {
  pieces: TrackedPiece[];
  label: string;
}

export function ChessBoard({ pieces, label }: ChessBoardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      role="img"
      aria-label={label}
      className="relative aspect-square w-full max-w-[440px] overflow-hidden rounded-sm border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)]"
    >
      {/* squares */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => {
          const file = i % 8;
          const rank = Math.floor(i / 8);
          const isDark = (file + rank) % 2 === 1;
          return (
            <div key={i} className={isDark ? 'bg-board-dark' : 'bg-board-light'} />
          );
        })}
      </div>

      {/* pieces */}
      {pieces
        .filter((p) => !p.captured)
        .map((p) => {
          const { left, top } = squareToPercent(p.square);
          return (
            <motion.div
              key={p.id}
              className="absolute flex items-center justify-center text-[clamp(20px,7.5vw,38px)] leading-none select-none"
              style={{
                width: '12.5%',
                height: '12.5%',
                color: p.color === 'w' ? 'var(--color-parchment)' : 'var(--color-ink)',
                // Layered text-shadow: a tight dark outline + a soft drop shadow
                textShadow:
                  p.color === 'w'
                    ? '0 0 3px rgba(0,0,0,0.9), 0 2px 5px rgba(0,0,0,0.6)'
                    : '0 1px 1px rgba(242,234,217,0.35)',
              }}
              animate={{ left: `${left}%`, top: `${top}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 260, damping: 24 }
              }
            >
              {GLYPHS[`${p.color}-${p.type}`]}
            </motion.div>
          );
        })}
    </div>
  );
}
