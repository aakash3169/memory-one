import React, { useState } from 'react';
import { CAMPAIGN_LEVELS } from './gameEngine';

export type ThemeMode = 'system' | 'light' | 'dark';

interface HeaderProps {
  guestName: string;
  onChangeGuestName: (name: string) => void;
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onNavigateHome: () => void;
}

export const SiteHeader: React.FC<HeaderProps> = ({
  guestName,
  onChangeGuestName,
  themeMode,
  onChangeThemeMode,
  onNavigateHome,
}) => {
  const [blinkColor, setBlinkColor] = useState<'orange' | 'blue'>('orange');
  const [editingName, setEditingName] = useState(guestName);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      onChangeGuestName(editingName.trim());
    }
  };

  return (
    <header
      id="site-header"
      className="relative flex min-h-16 flex-wrap items-center gap-x-4 gap-y-4 sm:gap-x-8 px-4 py-3 sm:px-6 lg:px-8"
    >
      <a
        href="/memory"
        id="home-link"
        data-blink={blinkColor}
        onMouseEnter={() => setBlinkColor(Math.random() < 0.5 ? 'orange' : 'blue')}
        onClick={(e) => {
          e.preventDefault();
          onNavigateHome();
        }}
        className="group flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 300"
          overflow="visible"
          aria-hidden="true"
          className="h-10 shrink-0 drop-shadow-sm"
        >
          <g className="octo-top text-octo-orange dark:text-octo-orange-light">
            <g fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round">
              <path d="M78 120C52 128 34 112 30 86"></path>
              <path d="M92 134C64 142 30 140 10 118"></path>
              <path d="M162 120C188 128 206 112 210 86"></path>
              <path d="M148 134C176 142 210 140 230 118"></path>
            </g>
            <circle cx="120" cy="88" r="62" fill="currentColor"></circle>
            <circle cx="98" cy="84" r="15" fill="#fff"></circle>
            <circle cx="142" cy="84" r="15" fill="#fff"></circle>
            <circle cx="98" cy="90" r="7" fill="#171532"></circle>
            <circle cx="142" cy="90" r="7" fill="#171532"></circle>
            <path
              d="M110 112Q120 120 130 112"
              fill="none"
              stroke="#171532"
              strokeWidth="5"
              strokeLinecap="round"
            ></path>
          </g>
          <g className="octo-bottom text-octo-indigo dark:text-octo-indigo-light">
            <g transform="translate(0 300) scale(1 -1)">
              <g fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round">
                <path d="M78 120C52 128 34 112 30 86"></path>
                <path d="M92 134C64 142 30 140 10 118"></path>
                <path d="M162 120C188 128 206 112 210 86"></path>
                <path d="M148 134C176 142 210 140 230 118"></path>
              </g>
              <circle cx="120" cy="88" r="62" fill="currentColor"></circle>
              <circle cx="98" cy="84" r="15" fill="#fff"></circle>
              <circle cx="142" cy="84" r="15" fill="#fff"></circle>
              <circle cx="98" cy="90" r="7" fill="#171532"></circle>
              <circle cx="142" cy="90" r="7" fill="#171532"></circle>
              <path
                d="M110 112Q120 120 130 112"
                fill="none"
                stroke="#171532"
                strokeWidth="5"
                strokeLinecap="round"
              ></path>
            </g>
          </g>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-10 12 692 98"
          role="img"
          aria-label="Octomocto"
          className="h-6 -translate-y-0.5"
        >
          <g fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
            <g className="text-octo-orange dark:text-octo-orange-light">
              <circle cx="26" cy="74" r="26"></circle>
              <path d="M124.4 55.6A26 26 0 1 0 124.4 92.4"></path>
              <path d="M166 22V84Q166 100 182 100"></path>
              <path d="M152 48H184"></path>
              <circle cx="238" cy="74" r="26"></circle>
            </g>
            <g className="text-octo-navy dark:text-white">
              <path d="M292 48V100"></path>
              <path d="M292 70A22 22 0 0 1 336 70V100"></path>
              <path d="M336 70A22 22 0 0 1 380 70V100"></path>
            </g>
            <g className="text-octo-indigo dark:text-octo-indigo-light" transform="translate(408 0)">
              <circle cx="26" cy="74" r="26"></circle>
              <path d="M124.4 55.6A26 26 0 1 0 124.4 92.4"></path>
              <path d="M166 22V84Q166 100 182 100"></path>
              <path d="M152 48H184"></path>
              <circle cx="238" cy="74" r="26"></circle>
            </g>
          </g>
          <g className="fill-octo-navy dark:fill-white">
            <circle className="wordmark-eye-orange" cx="33" cy="74" r="9"></circle>
            <circle className="wordmark-eye-orange" cx="245" cy="74" r="9"></circle>
            <circle className="wordmark-eye-blue" cx="427" cy="74" r="9"></circle>
            <circle className="wordmark-eye-blue" cx="639" cy="74" r="9"></circle>
          </g>
        </svg>
      </a>

      <div id="site-menu" className="contents">
        <div className="ml-auto flex items-center gap-4">
          <nav id="guest-menu" className="group relative text-sm">
            <button
              id="guest-menu-button"
              type="button"
              className="flex cursor-pointer items-center gap-2 text-base-content/70 transition group-hover:text-base-content group-focus-within:text-base-content"
            >
              <span className="hero-user-circle size-6"></span>
              <span>{guestName}</span>
            </button>

            <div
              id="guest-menu-dropdown"
              className="invisible absolute right-0 z-30 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
              <div className="min-w-64 space-y-2 rounded-xl border border-base-300 bg-base-100 p-3 shadow-lg">
                <form onSubmit={handleNameSubmit} className="space-y-1.5 px-1 pb-2">
                  <label htmlFor="guest-name-input" className="block text-xs font-medium text-base-content/60">
                    Your player name
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="guest-name-input"
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Your name"
                      className="min-w-0 flex-1 rounded-lg bg-base-200 px-2.5 py-1.5 text-sm outline-none ring-1 ring-base-content/10 focus:ring-2 focus:ring-octo-indigo"
                    />
                    <button
                      type="submit"
                      className="shrink-0 rounded-lg bg-octo-indigo px-3 py-1.5 text-xs font-medium text-white transition hover:bg-octo-indigo/90"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <div className="flex items-center justify-between gap-6 px-1 py-1.5 border-t border-base-300 pt-2.5">
                  <span className="text-base-content/70">Theme</span>
                  <div
                    id="theme-toggle"
                    className="relative flex items-center rounded-full bg-base-content/5 p-0.5 ring-1 ring-base-content/10"
                  >
                    <div
                      className="absolute top-0.5 left-0.5 size-7 rounded-full bg-base-100 shadow-sm ring-1 ring-base-content/10 transition-[left] duration-200"
                      style={{
                        left:
                          themeMode === 'system'
                            ? '0.125rem'
                            : themeMode === 'light'
                              ? '1.875rem'
                              : '3.625rem',
                      }}
                    ></div>

                    <button
                      id="theme-system"
                      type="button"
                      title="System theme"
                      aria-label="System theme"
                      onClick={() => onChangeThemeMode('system')}
                      className={`relative flex size-7 cursor-pointer items-center justify-center rounded-full transition hover:text-base-content ${
                        themeMode === 'system' ? 'text-base-content' : 'text-base-content/50'
                      }`}
                    >
                      <span className="hero-computer-desktop-micro size-4"></span>
                    </button>
                    <button
                      id="theme-light"
                      type="button"
                      title="Light theme"
                      aria-label="Light theme"
                      onClick={() => onChangeThemeMode('light')}
                      className={`relative flex size-7 cursor-pointer items-center justify-center rounded-full transition hover:text-base-content ${
                        themeMode === 'light' ? 'text-base-content' : 'text-base-content/50'
                      }`}
                    >
                      <span className="hero-sun-micro size-4"></span>
                    </button>
                    <button
                      id="theme-dark"
                      type="button"
                      title="Dark theme"
                      aria-label="Dark theme"
                      onClick={() => onChangeThemeMode('dark')}
                      className={`relative flex size-7 cursor-pointer items-center justify-center rounded-full transition hover:text-base-content ${
                        themeMode === 'dark' ? 'text-base-content' : 'text-base-content/50'
                      }`}
                    >
                      <span className="hero-moon-micro size-4"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export const SiteFooter: React.FC = () => {
  return (
    <footer
      id="site-footer"
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-6 text-xs text-base-content/50 sm:px-6 lg:px-8"
    >
      <span>
        &copy; 2026{' '}
        <a
          id="author-link"
          href="https://mxgrn.com?utm_source=octomocto"
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-base-content"
        >
          Max Gorin
        </a>
      </span>
      <a href="/memory" id="privacy-link" className="transition hover:text-base-content">
        Privacy Policy
      </a>
      <a href="/memory" id="terms-link" className="transition hover:text-base-content">
        Terms of Service
      </a>
      <a id="suggest-game-link" href="mailto:hi@octomocto.com" className="transition hover:text-base-content">
        Suggest a game
      </a>
      <a
        id="patreon-link"
        href="https://patreon.com/mxgrn"
        target="_blank"
        rel="noreferrer"
        className="group -my-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition bg-octo-orange/10 text-octo-orange ring-1 ring-octo-orange/30 hover:-translate-y-0.5 hover:bg-octo-orange hover:text-white hover:shadow-md hover:shadow-octo-orange/20 active:scale-95 dark:bg-octo-orange-light/10 dark:text-octo-orange-light dark:ring-octo-orange-light/30 dark:hover:bg-octo-orange-light dark:hover:text-base-100"
      >
        <span className="hero-heart-solid size-3.5 transition group-hover:scale-110"></span>
        Feed Octo &amp; Mocto
      </a>
    </footer>
  );
};

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      id="rules"
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
    >
      <div
        id="rules-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      ></div>
      <div className="relative flex min-h-full items-center justify-center p-4" onClick={onClose}>
        <div
          id="rules-panel"
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-2xl bg-base-100 p-6 shadow-xl ring-1 ring-base-content/10"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="rules-title" className="text-xl font-semibold">
              How to play
            </h2>
            <button
              id="rules-close"
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-base-content/60 transition hover:bg-base-200 hover:text-base-content"
            >
              <span className="hero-x-mark size-5"></span>
            </button>
          </div>
          <ul className="space-y-2.5 text-base-content/80">
            <li className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-octo-indigo"></span>
              <span>Turn over 2 cards at a time (3 for triplets) to find the cards with the same image.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-octo-indigo"></span>
              <span>If they match, you get a point for each card, and you go again. If not, the next player goes.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-octo-indigo"></span>
              <span>
                <strong>2–4 Players on a Single Device (Pass &amp; Play):</strong> Choose 2, 3, or 4 players and select{' '}
                <em>Same device</em> to take turns right on one screen, or play against smart AI bots!
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-octo-indigo"></span>
              <span>
                <strong>Bombs &amp; Demining:</strong> Turning an unseen bomb is safe, but turning a bomb that was already
                seen puts you out! Once all bombs are seen, turn all bombs in a row to demine the field for bonus points.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-octo-indigo"></span>
              <span>Whoever has the most points wins. Alone, clear the field as fast as you can.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface CampaignMapProps {
  unlockedLevel: number;
  selectedLevel: number;
  unlockAll: boolean;
  completedTimes: Record<number, number>;
  onSelectLevel: (level: number) => void;
  onStartLevel: (level: number) => void;
  onToggleUnlockAll: () => void;
}

export const CampaignMapSection: React.FC<CampaignMapProps> = ({
  unlockedLevel,
  selectedLevel,
  unlockAll,
  completedTimes,
  onSelectLevel,
  onStartLevel,
  onToggleUnlockAll,
}) => {
  const effectiveUnlocked = unlockAll ? CAMPAIGN_LEVELS.length : unlockedLevel;

  const renderNode = (spec: (typeof CAMPAIGN_LEVELS)[number], cols: 3 | 4, idx: number) => {
    const row = Math.floor(idx / cols);
    const colInRow = idx % cols;
    const isReversed = row % 2 === 1;
    const visualCol = isReversed ? cols - 1 - colInRow : colInRow;
    const leftPct = (visualCol / (cols - 1)) * 100;
    const topPx = 40 + row * 104;

    const isUnlocked = spec.level <= effectiveUnlocked;
    const isCompleted = completedTimes[spec.level] !== undefined;
    const isSelected = spec.level === selectedLevel;

    return (
      <a
        key={`level-${cols}-${spec.level}`}
        href={`/memory/campaign?level=${spec.level}`}
        id={`level-${cols}-${spec.level}`}
        style={{ left: `${leftPct}%`, top: `${topPx}px` }}
        aria-label={`Level ${spec.level}`}
        aria-current={isSelected ? 'true' : undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelectLevel(spec.level);
          if (isUnlocked) {
            onStartLevel(spec.level);
          }
        }}
        className="group absolute flex w-20 -translate-x-1/2 -translate-y-8 flex-col items-center cursor-pointer"
      >
        <span className="relative grid size-16 place-items-center transition group-hover:scale-105">
          <svg viewBox="0 0 64 64" className="absolute inset-0" aria-hidden="true">
            {isSelected && (
              <circle
                cx="32"
                cy="32"
                r="29"
                fill="none"
                strokeWidth="4"
                className="stroke-octo-indigo/30"
              ></circle>
            )}
            <circle
              cx="32"
              cy="32"
              r="23"
              strokeWidth={isUnlocked ? '3' : '1.5'}
              className={
                isCompleted
                  ? 'fill-octo-indigo stroke-octo-indigo'
                  : isUnlocked
                    ? 'fill-base-100 stroke-octo-indigo'
                    : 'fill-base-200 stroke-base-content/15'
              }
            ></circle>
          </svg>
          <span
            className={`relative flex flex-col items-center leading-none ${
              isCompleted
                ? 'text-white'
                : isUnlocked
                  ? 'text-octo-indigo'
                  : 'text-base-content/40'
            }`}
          >
            <span className={`font-semibold tabular-nums ${isUnlocked ? 'text-lg' : 'text-sm'}`}>
              {spec.level}
            </span>
            {!isUnlocked && <span className="hero-lock-closed-mini mt-0.5 size-3"></span>}
          </span>
          {spec.set === 'triplets' && (
            <span
              title="Triplets"
              className={`absolute grid size-4 place-items-center rounded-full bg-base-100 text-[10px] font-semibold ring-1 top-2 right-2 ${
                isUnlocked
                  ? 'text-octo-indigo ring-octo-indigo/40'
                  : 'text-base-content/40 ring-base-content/15'
              }`}
            >
              3
            </span>
          )}
        </span>
        <span className="mt-0.5 text-xs whitespace-nowrap text-base-content/60">
          {spec.cards} cards
        </span>
      </a>
    );
  };

  const selectedSpec =
    CAMPAIGN_LEVELS.find((l) => l.level === selectedLevel) || CAMPAIGN_LEVELS[0];
  const canStartSelected = selectedSpec.level <= effectiveUnlocked;

  return (
    <div
      id="campaign"
      className="relative mx-auto flex w-full max-w-md flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-2 xl:col-start-2 xl:row-start-2 xl:max-w-none"
    >
      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-left font-semibold">
            <span className="hero-map size-4 text-octo-indigo"></span> Levels
          </h3>
          <button
            id="campaign-unlock-toggle"
            type="button"
            onClick={onToggleUnlockAll}
            className="cursor-pointer rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-content/70 transition hover:bg-octo-mist hover:text-octo-indigo"
          >
            {unlockAll ? 'Lock progression' : 'Unlock all 23 levels'}
          </button>
        </div>

        <div id="campaign-map" className="@container w-full">
          {/* 3-column snake map for narrow screens */}
          <div className="@sm:hidden">
            <div className="relative mx-10" style={{ height: '832px' }}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => {
                const topPx = 40 + row * 104;
                const isLastRow = row === 7;
                return (
                  <React.Fragment key={`path3-${row}`}>
                    <div
                      className="absolute h-0 -mt-px border-2 border-dashed border-base-content/20 border-x-0! border-b-0!"
                      style={{
                        left: isLastRow ? '50%' : '0%',
                        width: isLastRow ? '50%' : '100%',
                        top: `${topPx}px`,
                      }}
                    ></div>
                    {!isLastRow && (
                      <div
                        className={`absolute w-8 ${
                          row % 2 === 0
                            ? 'left-full rounded-r-full border-l-0!'
                            : 'right-full rounded-l-full border-r-0!'
                        } -mt-px border-2 border-dashed border-base-content/20`}
                        style={{ top: `${topPx}px`, height: '104px' }}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
              {CAMPAIGN_LEVELS.map((spec, idx) => renderNode(spec, 3, idx))}
            </div>
          </div>

          {/* 4-column snake map for @sm and wider */}
          <div className="hidden @sm:block">
            <div className="relative mx-10" style={{ height: '624px' }}>
              {[0, 1, 2, 3, 4, 5].map((row) => {
                const topPx = 40 + row * 104;
                const isLastRow = row === 5;
                return (
                  <React.Fragment key={`path4-${row}`}>
                    <div
                      className="absolute h-0 -mt-px border-2 border-dashed border-base-content/20 border-x-0! border-b-0!"
                      style={{
                        left: isLastRow ? '33.3333%' : '0%',
                        width: isLastRow ? '66.6667%' : '100%',
                        top: `${topPx}px`,
                      }}
                    ></div>
                    {!isLastRow && (
                      <div
                        className={`absolute w-8 ${
                          row % 2 === 0
                            ? 'left-full rounded-r-full border-l-0!'
                            : 'right-full rounded-l-full border-r-0!'
                        } -mt-px border-2 border-dashed border-base-content/20`}
                        style={{ top: `${topPx}px`, height: '104px' }}
                      ></div>
                    )}
                  </React.Fragment>
                );
              })}
              {CAMPAIGN_LEVELS.map((spec, idx) => renderNode(spec, 4, idx))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-col items-center gap-2 bg-linear-to-t from-base-100 from-70% to-transparent pt-6 pb-4">
        <button
          id="start-campaign-level"
          type="button"
          disabled={!canStartSelected}
          onClick={() => onStartLevel(selectedSpec.level)}
          className="cursor-pointer rounded-full bg-octo-indigo px-8 py-3 font-medium text-white shadow-lg shadow-octo-indigo/25 transition hover:-translate-y-0.5 hover:bg-octo-indigo/90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Play Level {selectedSpec.level} ({selectedSpec.cards} cards ·{' '}
          {selectedSpec.set === 'triplets' ? 'Triplets' : 'Pairs'})
        </button>
      </div>
    </div>
  );
};
