import type { Move } from 'chess.js';

export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface TrackedPiece {
  id: string;
  type: PieceType;
  color: PieceColor;
  square: string;
  captured: boolean;
}

const START_ORDER: [PieceType, number][] = [
  ['r', 0],
  ['n', 1],
  ['b', 2],
  ['q', 3],
  ['k', 4],
  ['b', 5],
  ['n', 6],
  ['r', 7],
];

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function createInitialPieces(): TrackedPiece[] {
  const pieces: TrackedPiece[] = [];

  const addBackRank = (color: PieceColor, rank: number) => {
    for (const [type, fileIdx] of START_ORDER) {
      const square = `${FILES[fileIdx]}${rank}`;
      pieces.push({ id: `${color}-${type}-${square}`, type, color, square, captured: false });
    }
  };

  const addPawnRank = (color: PieceColor, rank: number) => {
    for (let fileIdx = 0; fileIdx < 8; fileIdx++) {
      const square = `${FILES[fileIdx]}${rank}`;
      pieces.push({ id: `${color}-p-${square}`, type: 'p', color, square, captured: false });
    }
  };

  addBackRank('w', 1);
  addPawnRank('w', 2);
  addPawnRank('b', 7);
  addBackRank('b', 8);

  return pieces;
}

function squareRank(square: string): number {
  return Number(square[1]);
}

function squareFile(square: string): string {
  return square[0];
}

/** Applies a single verbose chess.js move to a piece list, returning a new list. */
export function applyMove(pieces: TrackedPiece[], move: Move): TrackedPiece[] {
  const next = pieces.map((p) => ({ ...p }));

  const mover = next.find((p) => p.square === move.from && !p.captured);
  if (!mover) return next;

  // Captures: standard capture removes whatever occupies the destination square.
  if (move.flags.includes('c')) {
    const captured = next.find((p) => p.square === move.to && !p.captured && p.id !== mover.id);
    if (captured) captured.captured = true;
  }

  // En passant: the captured pawn sits beside the destination, not on it.
  if (move.flags.includes('e')) {
    const capturedSquare = `${squareFile(move.to)}${squareRank(move.from)}`;
    const captured = next.find((p) => p.square === capturedSquare && !p.captured);
    if (captured) captured.captured = true;
  }

  mover.square = move.to;
  if (move.promotion) {
    mover.type = move.promotion as PieceType;
  }

  // Castling: move the rook alongside the king.
  if (move.flags.includes('k')) {
    const rank = squareRank(move.from);
    const rook = next.find((p) => p.square === `h${rank}` && !p.captured);
    if (rook) rook.square = `f${rank}`;
  }
  if (move.flags.includes('q')) {
    const rank = squareRank(move.from);
    const rook = next.find((p) => p.square === `a${rank}` && !p.captured);
    if (rook) rook.square = `d${rank}`;
  }

  return next;
}
