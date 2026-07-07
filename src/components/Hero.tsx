import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameReplay } from '../hooks/useGameReplay';
import { EVERGREEN_PGN, GAME_MATCHUP, GAME_TITLE } from '../data/evergreenGame';
import { ChessBoard } from './ChessBoard';
import { MoveTicker } from './MoveTicker';
import { PlaybackControls } from './PlaybackControls';
import XLchess from '../assets/xlchess.png';
import { BackgroundPieces } from './BackgroundPieces';

export function Hero() {
  const { replayMoves, pieces, ply, totalPlies, isPlaying, next, prev, togglePlaying, restart } =
    useGameReplay(EVERGREEN_PGN);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlaying();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [next, prev, togglePlaying]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink px-6 py-16 sm:px-10 lg:px-16">

      <BackgroundPieces />

      {/* ambient board-grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-parchment) 1px, transparent 1px), linear-gradient(90deg, var(--color-parchment) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl px-6 lg:px-8 flex-col items-center gap-14 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* Copy */}
        <div className="flex max-w-xl flex-col items-start text-left pt-20 sm:pt-30 lg:pt-20">

          <motion.img
            src={XLchess}
            alt="xlchess logo"
            className="h-40 lg:h-45 mb-4 w-auto object-contain block"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight text-parchment"
          >
            Build the Future of {" "}
            <br />
            Online Chess.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 mt-10 font-mono text-md font-bold uppercase tracking-[0.25em] text-accent-soft"
          >
            Making the Best Move on the Way to the Top
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-1 text-balance text-base leading-relaxed text-parchment-dim/85 sm:text-lg"
          >
            A complete chess platform to play, learn, compete, and grow—built to become the world's #1 destination for chess.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#play"
              className="rounded-sm bg-accent px-7 py-3 font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-accent-soft focus-visible:-translate-y-0.5"
            >
              Play now
            </a>
            <a
              href="#learn"
              className="rounded-sm border border-parchment/20 px-7 py-3 font-medium text-parchment transition-colors hover:border-accent-soft hover:text-accent-soft"
            >
              Explore lessons
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex gap-8 font-mono text-xs text-parchment-dim/60"
          >
            <span>4.2M rated games</span>
            <span aria-hidden="true">·</span>
            <span>180 countries</span>
            <span aria-hidden="true">·</span>
            <span>0 ads, ever</span>
          </motion.div>
        </div>

        {/* Living board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex w-full max-w-[440px] flex-col items-center gap-5"
        >
          <div className="flex w-full items-baseline justify-between font-mono text-xs text-parchment-dim/60">
            <span className="text-accent-soft">{GAME_TITLE}</span>
            <span>{GAME_MATCHUP}</span>
          </div>

          <ChessBoard pieces={pieces} label={`${GAME_TITLE}, move ${ply} of ${totalPlies}`} />

          <MoveTicker moves={replayMoves} ply={ply} />

          <PlaybackControls
            isPlaying={isPlaying}
            ply={ply}
            totalPlies={totalPlies}
            onPrev={prev}
            onNext={next}
            onTogglePlay={togglePlaying}
            onRestart={restart}
          />
        </motion.div>
      </div>
    </section>
  );
}
