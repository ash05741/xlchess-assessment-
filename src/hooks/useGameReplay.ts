import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Move } from 'chess.js';
import { applyMove, createInitialPieces, type TrackedPiece } from '../lib/pieceTracker';

export interface ReplayMove {
  san: string;
  moveNumber: number;
  color: 'w' | 'b';
}

const AUTOPLAY_INTERVAL_MS = 1400;

export function useGameReplay(pgn: string) {
  const moves = useMemo<Move[]>(() => {
    const chess = new Chess();
    chess.loadPgn(pgn);
    return chess.history({ verbose: true });
  }, [pgn]);

  const replayMoves = useMemo<ReplayMove[]>(
    () =>
      moves.map((m, i) => ({
        san: m.san,
        moveNumber: Math.floor(i / 2) + 1,
        color: m.color,
      })),
    [moves],
  );

  // ply 0 = start position, ply N = after moves[N-1]
  const [ply, setPly] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const piecesAtPly = useMemo<TrackedPiece[][]>(() => {
    const frames: TrackedPiece[][] = [createInitialPieces()];
    for (const move of moves) {
      frames.push(applyMove(frames[frames.length - 1], move));
    }
    return frames;
  }, [moves]);

  const clampPly = useCallback(
    (value: number) => Math.max(0, Math.min(moves.length, value)),
    [moves.length],
  );

  const goTo = useCallback((value: number) => setPly(clampPly(value)), [clampPly]);
  const next = useCallback(() => setPly((p) => clampPly(p + 1)), [clampPly]);
  const prev = useCallback(() => setPly((p) => clampPly(p - 1)), [clampPly]);
  const togglePlaying = useCallback(() => setIsPlaying((p) => !p), []);

  useEffect(() => {
    if (!isPlaying) return;
    if (ply >= moves.length) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setInterval(() => {
      setPly((p) => {
        if (p + 1 >= moves.length) {
          setIsPlaying(false);
          return moves.length;
        }
        return p + 1;
      });
    }, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, moves.length]);

  const restart = useCallback(() => {
    setPly(0);
    setIsPlaying(true);
  }, []);

  return {
    replayMoves,
    pieces: piecesAtPly[ply],
    ply,
    totalPlies: moves.length,
    isPlaying,
    goTo,
    next,
    prev,
    togglePlaying,
    restart,
    isFinished: ply >= moves.length,
  };
}
