import type { ReactNode } from 'react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  ply: number;
  totalPlies: number;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onRestart: () => void;
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      // 1. Remove the title={label} attribute entirely
      onClick={onClick}
      disabled={disabled}
      // 2. Add 'group' and 'relative' to the beginning of the button's class list
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-parchment/15 text-parchment transition-colors hover:border-accent-soft hover:text-accent-soft disabled:opacity-30 disabled:hover:border-parchment/15 disabled:hover:text-parchment"
    >
      {children}

      {/* 3. Add the custom CSS tooltip inside the button */}
      <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-parchment opacity-0 transition-opacity group-hover:opacity-100 z-10">
        {label}
      </span>
    </button>
  );
}

export function PlaybackControls({
  isPlaying,
  ply,
  totalPlies,
  onPrev,
  onNext,
  onTogglePlay,
  onRestart,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <IconButton label="Restart game" onClick={onRestart}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconButton>
      <IconButton label="Previous move" onClick={onPrev} disabled={ply === 0}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 4l-12 8 12 8z" />
        </svg>
      </IconButton>
      <IconButton label={isPlaying ? 'Pause replay' : 'Play replay'} onClick={onTogglePlay}>
        {isPlaying ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="4" width="5" height="16" />
            <rect x="14" y="4" width="5" height="16" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l16 8-16 8z" />
          </svg>
        )}
      </IconButton>
      <IconButton label="Next move" onClick={onNext} disabled={ply === totalPlies}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4l12 8-12 8z" />
        </svg>
      </IconButton>
      <span className="ml-1 font-mono text-xs text-parchment-dim/60">
        {ply}/{totalPlies}
      </span>
    </div>
  );
}
