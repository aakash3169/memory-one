import { getAssetUrl } from "./svgAssets";
import React, { useEffect, useState } from 'react';
import {
  MemoryGameState,
  MemoryPlayer,
  selectBestLayout,
  computeFieldSpace,
  computeCardGap,
  computeFieldWidthCss,
  canFlipCard,
  formatClockTime,
  getWinners,
} from './gameEngine';

interface GameRoomProps {
  game: MemoryGameState;
  muted: boolean;
  onToggleMuted: () => void;
  onFlipCard: (index: number) => void;
  onRestart: () => void;
  onNextLevel: () => void;
  onBackToSettings: () => void;
  onBackToCampaign: () => void;
  onSwitchWaitingToLocal: () => void;
}

export const GameRoom: React.FC<GameRoomProps> = ({
  game,
  muted,
  onToggleMuted,
  onFlipCard,
  onRestart,
  onNextLevel,
  onBackToSettings,
  onBackToCampaign,
  onSwitchWaitingToLocal,
}) => {
  const [viewport, setViewport] = useState<[number, number]>(() => [
    typeof window !== 'undefined' ? window.innerWidth : 1280,
    typeof window !== 'undefined' ? window.innerHeight : 800,
  ]);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onResize = () => {
      setViewport([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (game.waiting || game.finished || !game.started) return;
    const id = window.setInterval(() => {
      setNowMs(Date.now());
    }, 200);
    return () => window.clearInterval(id);
  }, [game.waiting, game.finished, game.started]);

  const solo = game.players.length === 1;
  const liveElapsedMs = game.finished
    ? game.elapsedMs
    : game.started && game.startedAtMs !== null
      ? Math.max(0, nowMs - game.startedAtMs)
      : 0;

  const layout = selectBestLayout(
    viewport,
    game.layouts,
    game.cards.length,
    game.playersNeeded,
    game.players.length,
    false
  );
  const space = computeFieldSpace(viewport, game.playersNeeded, game.players.length, false);
  const gap = computeCardGap(space, layout);
  const fieldWidth = computeFieldWidthCss(
    viewport,
    layout,
    gap,
    game.playersNeeded,
    game.players.length,
    false
  );

  const bombsUp = game.cards.filter((c) => c.bomb && c.state === 'up').length;
  const bombMessageShown = (game.offer || game.demining) && !game.finished;

  const currentPlayer = game.players.find((p) => p.id === game.turn) || game.players[0];
  const upCountInTurn = game.cards.filter((c) => c.state === 'up').length;
  const flipsRemainingInTurn = game.ongoing
    ? Math.max(1, game.set - upCountInTurn)
    : game.set;

  const formatAccuracy = (acc: number | null) => (acc !== null ? `${acc}%` : '—');

  const getPlayerLabel = (p: MemoryPlayer) => {
    const base = p.name || p.colorName;
    if (game.playMode === 'bot') {
      return p.isBot ? `${base} (AI)` : `${base} (you)`;
    }
    return base;
  };

  const renderBombMessage = (inRow: boolean) => {
    const msg = game.demining
      ? 'Demine the field now: turn all other bombs. A wrong card puts you out.'
      : 'You found the last bomb! Turn another bomb now to demine the field, or any other card to play on.';

    return (
      <div
        id={inRow ? 'memory-bomb-message-row' : 'memory-bomb-message'}
        className={
          inRow
            ? 'memory-slide-in fixed inset-x-2 top-0 z-30 flex min-h-12 items-center gap-2 rounded-b-2xl bg-octo-indigo px-4 py-2 text-xs leading-tight font-medium text-white shadow-lg lg:hidden'
            : 'hidden items-center gap-3 rounded-2xl bg-octo-indigo px-4 py-2.5 text-sm font-medium text-white shadow-sm lg:order-2 lg:flex lg:py-3'
        }
      >
        <img
          src={getAssetUrl("/images/memory/bomb.svg")}
          alt=""
          className={`shrink-0 animate-bounce ${inRow ? 'size-6' : 'size-8'}`}
        />
        <p className="flex-1">{msg}</p>
        {game.demining && (
          <span
            id={`memory-bomb-progress${inRow ? '-row' : ''}`}
            className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 font-semibold tabular-nums"
          >
            {bombsUp}/{game.bombs}
          </span>
        )}
      </div>
    );
  };

  const renderBadges = (p: MemoryPlayer) => (
    <span className="flex shrink-0 items-center gap-1 empty:hidden">
      {p.deminer && (
        <span
          className="hero-shield-check-solid size-4 text-amber-500"
          title="Deminer"
        ></span>
      )}
      {p.dead && (
        <img
          src={getAssetUrl("/images/memory/bomb.svg")}
          alt="Out"
          title="Out"
          className="size-4"
        />
      )}
    </span>
  );

  const renderFeed = () => (
    <p
      id="memory-feed"
      className="mt-2 max-w-sm border-t border-white/15 pt-4 text-center text-sm leading-10 text-balance text-white/80"
    >
      Enjoying Octomocto?{' '}
      <a
        href="https://patreon.com/mxgrn"
        target="_blank"
        rel="noopener noreferrer"
        className="group mx-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-octo-orange px-4 py-1.5 align-middle leading-5 font-semibold text-white shadow-lg shadow-octo-orange/30 transition hover:-translate-y-0.5 hover:bg-octo-orange-light active:translate-y-0"
      >
        <span className="hero-heart-solid size-4 transition group-hover:scale-110"></span>
        Feed Octo &amp; Mocto
      </a>{' '}
      to keep it ad-free.
    </p>
  );

  const renderCampaignResult = () => {
    if (!game.campaign) return null;
    const primary =
      'cursor-pointer rounded-full bg-white px-6 py-2.5 font-medium text-octo-indigo shadow-lg transition hover:-translate-y-0.5 hover:bg-octo-mist active:translate-y-0';
    const last = game.campaign.level >= game.campaign.levels;
    const cleared = game.cards.filter((c) => c.state === 'cleared').length;

    let message = 'Perfect!';
    let details = `Level ${game.campaign.level} done · Time ${formatClockTime(game.elapsedMs)}`;
    if (game.failed) {
      message = 'Wrong card!';
      details = `You cleared ${cleared} of ${game.cards.length} cards.`;
    } else if (last) {
      message = 'You finished the campaign!';
      details = `Time ${formatClockTime(game.elapsedMs)}`;
    }

    return (
      <div
        id="memory-result"
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-octo-navy/70 p-4 text-center text-white backdrop-blur-sm"
      >
        <p className="text-3xl font-semibold">{message}</p>
        <p id="memory-final-time" className="text-lg tabular-nums opacity-80">
          {details}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {game.failed ? (
            <button id="memory-retry" type="button" onClick={onRestart} className={primary}>
              Try again
            </button>
          ) : !last ? (
            <button id="memory-next-level" type="button" onClick={onNextLevel} className={primary}>
              Next level
            </button>
          ) : null}
          <a
            id="memory-campaign-map"
            href="/memory/campaign"
            onClick={(e) => {
              e.preventDefault();
              onBackToCampaign();
            }}
            className="rounded-full px-5 py-2.5 font-medium text-white ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
          >
            Back to the map
          </a>
        </div>
        {renderFeed()}
      </div>
    );
  };

  const renderResult = () => {
    const ranked = [...game.players].sort((a, b) => b.score - a.score);
    const winners = getWinners(game.players);

    let message = '';
    if (solo) {
      message = game.failed ? 'Boom!' : 'Done!';
    } else if (winners.length === 1) {
      const w = winners[0];
      if (game.playMode === 'bot' && !w.isBot) {
        message = 'You win!';
      } else if (w.name) {
        message = `${w.name} wins!`;
      } else {
        message = `The ${w.colorName} player wins!`;
      }
    } else {
      message = "It's a tie!";
    }

    return (
      <div
        id="memory-result"
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-octo-navy/70 p-4 text-white backdrop-blur-sm"
      >
        <p className="text-3xl font-semibold">{message}</p>
        <p id="memory-final-time" className="text-lg tabular-nums opacity-80">
          Time {formatClockTime(game.elapsedMs)}
          {solo ? ` · Accuracy ${formatAccuracy(game.players[0]?.accuracy ?? null)}` : ''}
        </p>

        {solo && game.failed && (
          <p id="memory-exploded" className="text-sm text-white/80">
            {game.players.some((p) => p.failedDemining)
              ? 'The demining failed: the last card was not a bomb.'
              : 'You turned a bomb that was seen.'}
          </p>
        )}

        {solo && !game.failed && game.players.some((p) => p.deminer) && (
          <p
            id="memory-deminer"
            className="flex items-center gap-1.5 text-sm font-medium text-amber-300"
          >
            <span className="hero-shield-check-solid size-5"></span>
            You demined the field!
          </p>
        )}

        {game.deminingEnabled &&
          game.bombs > 0 &&
          !game.failed &&
          !game.players.some((p) => p.deminer) && (
            <p id="memory-not-demined" className="flex items-center gap-1.5 text-sm text-white/80">
              <img src={getAssetUrl("/images/memory/bomb.svg")} alt="" className="size-5" />
              The field wasn&apos;t demined.
            </p>
          )}

        {!solo && (
          <ol className="flex flex-col gap-1 text-sm min-w-56">
            {ranked.map((player) => (
              <li key={player.id} className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full"
                  style={{ background: player.color }}
                ></span>
                <span className="flex-1">{getPlayerLabel(player)}</span>
                {renderBadges(player)}
                <span className="pl-6 font-semibold tabular-nums">{player.score}</span>
                <span
                  className="w-10 text-right tabular-nums opacity-70"
                  title="Accuracy"
                >
                  {formatAccuracy(player.accuracy)}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="memory-play-again"
            type="button"
            onClick={onRestart}
            className="cursor-pointer rounded-full bg-white px-6 py-2.5 font-medium text-octo-indigo shadow-lg transition hover:-translate-y-0.5 hover:bg-octo-mist active:translate-y-0"
          >
            Play again
          </button>
          <a
            id="memory-change-settings"
            href="/memory"
            onClick={(e) => {
              e.preventDefault();
              onBackToSettings();
            }}
            className="rounded-full px-5 py-2.5 font-medium text-white ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
          >
            Change settings
          </a>
        </div>

        {renderFeed()}
      </div>
    );
  };

  const renderWaiting = () => (
    <div
      id="memory-waiting"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-octo-navy/80 p-4 text-center text-white"
    >
      <p className="text-3xl font-semibold">Waiting for players</p>
      <p id="memory-waiting-count" className="text-lg tabular-nums opacity-80">
        {game.players.length} of {game.playersNeeded} players are in
      </p>
      <p className="max-w-sm text-sm opacity-70">
        Open this link in another tab or device to join, or switch to Same-Device Pass &amp; Play now.
      </p>
      <button
        id="memory-switch-local"
        type="button"
        onClick={onSwitchWaitingToLocal}
        className="mt-2 cursor-pointer rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-octo-indigo shadow-lg transition hover:-translate-y-0.5 hover:bg-octo-mist"
      >
        Play on Same Device (Pass &amp; Play) Now
      </button>
    </div>
  );

  // Build field items (inserting 1 empty div in the middle when layout.gaps > 0)
  const cardButtons = game.cards.map((card, index) => {
    const isUp = card.state !== 'down';
    const isCleared = card.state === 'cleared';
    const isBombFace = card.bomb && card.seen;
    const isPictureFace = !card.bomb && card.image !== null && card.seen;
    const clickable =
      canFlipCard(game, index) && !(game.playMode === 'bot' && currentPlayer?.isBot);

    const classes = [
      'memory-card aspect-square',
      isUp ? 'is-up' : '',
      isCleared ? 'is-cleared' : '',
      isBombFace ? 'is-bomb' : '',
      clickable ? 'is-clickable' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        key={`card-${index}`}
        id={`memory-card-${index}`}
        type="button"
        data-card-index={index}
        onClick={() => clickable && onFlipCard(index)}
        className={classes}
      >
        <div className="memory-card-inner">
          <div className="memory-card-back rounded-lg"></div>
          <div className="memory-card-face rounded-lg">
            {isPictureFace && (
              <img
                src={getAssetUrl(`/images/memory/${game.theme}/${card.image}.svg`)} data-card-theme={game.theme}
                alt=""
                className="size-3/4 object-contain"
              />
            )}
            {isBombFace && (
              <img
                src={getAssetUrl("/images/memory/bomb.svg")}
                alt=""
                className="size-3/4 object-contain"
              />
            )}
          </div>
        </div>
      </button>
    );
  });

  const middle = Math.floor(cardButtons.length / 2);
  const fieldPlaces =
    layout.gaps > 0
      ? [
          ...cardButtons.slice(0, middle),
          <div key="middle-gap" className="pointer-events-none" />,
          ...cardButtons.slice(middle),
        ]
      : cardButtons;

  const clockColumns = (solo ? 2 : 1) + (game.bombs > 0 ? 1 : 0);

  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : `https://octomocto.com/memory/${game.id}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="flex-1 px-2 py-2 lg:px-8 lg:py-6">
      <div id="memory-main" className="space-y-4 w-full">
        <div
          id="memory-root"
          className={`flex w-full flex-col gap-2 select-none lg:flex-row lg:items-start lg:gap-8 ${
            !game.waiting && !game.finished ? 'is-playing' : ''
          }`}
        >
          <aside
            id="memory-panel"
            className="flex flex-col gap-2 lg:sticky lg:top-6 lg:w-72 lg:shrink-0 lg:gap-5"
          >
            <div className="flex items-center gap-1 lg:contents">
              <div className="min-w-0 lg:order-1">
                <div className="flex items-center gap-1 lg:gap-2">
                  <a
                    id="memory-home"
                    href="/memory"
                    onClick={(e) => {
                      e.preventDefault();
                      onBackToSettings();
                    }}
                    className="mr-1 shrink-0 transition hover:-translate-y-0.5 active:translate-y-0 lg:mr-0"
                  >
                    <img
                      src={getAssetUrl("/images/mark.svg")}
                      alt="octomocto"
                      className="h-8 w-auto dark:hidden lg:h-9"
                    />
                    <img
                      src={getAssetUrl("/images/mark-on-dark.svg")}
                      alt="octomocto"
                      className="hidden h-8 w-auto dark:block lg:h-9"
                    />
                  </a>
                  <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">
                    <a
                      id="memory-title-link"
                      href="/memory"
                      onClick={(e) => {
                        e.preventDefault();
                        onBackToSettings();
                      }}
                      className="transition hover:text-octo-indigo dark:hover:text-octo-indigo-light"
                    >
                      Memory
                    </a>
                  </h1>
                  {game.campaign && (
                    <span
                      id="memory-level"
                      className="shrink-0 rounded-full bg-octo-mist px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-octo-indigo dark:bg-octo-indigo/15 dark:text-octo-indigo-light"
                    >
                      Level {game.campaign.level}
                    </span>
                  )}
                  <button
                    id="memory-mute"
                    type="button"
                    onClick={onToggleMuted}
                    title={muted ? 'Turn the sounds on' : 'Turn the sounds off'}
                    className="grid size-8 cursor-pointer place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-90 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
                  >
                    <span
                      className={muted ? 'hero-speaker-x-mark size-5' : 'hero-speaker-wave size-5'}
                    ></span>
                  </button>
                </div>
                <p className="hidden text-sm opacity-60 lg:block">
                  {game.set === 2
                    ? 'Find the pairs of cards with the same image.'
                    : 'Find the triplets of cards with the same image.'}
                </p>
              </div>

              {/* Clock & stats */}
              <div
                id="memory-clock"
                className={`ml-auto flex gap-4 pr-2 lg:order-2 lg:ml-0 lg:grid lg:gap-0 lg:divide-x lg:divide-slate-200 lg:rounded-2xl lg:bg-white lg:py-3 lg:pr-0 lg:shadow-sm lg:ring-1 lg:ring-slate-200 dark:lg:divide-white/10 dark:lg:bg-white/5 dark:lg:shadow-none dark:lg:ring-white/10 ${
                  clockColumns === 1
                    ? 'lg:grid-cols-1'
                    : clockColumns === 2
                      ? 'lg:grid-cols-2'
                      : 'lg:grid-cols-3'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.625rem] font-medium tracking-wide text-slate-400 uppercase lg:text-xs">
                    time
                  </span>
                  <span
                    id="memory-time"
                    className="text-lg leading-tight font-light text-slate-700 tabular-nums lg:text-3xl dark:text-slate-100"
                  >
                    {formatClockTime(liveElapsedMs)}
                  </span>
                </div>
                {solo && (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[0.625rem] font-medium tracking-wide text-slate-400 uppercase lg:text-xs">
                      accuracy
                    </span>
                    <span
                      id="memory-accuracy"
                      className="text-lg leading-tight font-light text-slate-700 tabular-nums lg:text-3xl dark:text-slate-100"
                    >
                      {formatAccuracy(game.players[0]?.accuracy ?? null)}
                    </span>
                  </div>
                )}
                {game.bombs > 0 && (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[0.625rem] font-medium tracking-wide text-slate-400 uppercase lg:text-xs">
                      {game.demining ? 'demining' : 'bombs'}
                    </span>
                    <span
                      id="memory-bombs"
                      className="text-lg leading-tight font-light text-slate-700 tabular-nums lg:text-3xl dark:text-slate-100"
                    >
                      {game.demining ? `${bombsUp}/${game.bombs}` : `${game.bombsSeen}/${game.bombs}`}
                    </span>
                  </div>
                )}
              </div>

              {bombMessageShown && renderBombMessage(true)}

              <button
                id="memory-restart"
                type="button"
                onClick={onRestart}
                title="Restart game"
                className="group flex size-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-900 hover:ring-slate-300 active:scale-95 lg:order-5 lg:size-auto lg:self-start lg:px-4 lg:py-2 dark:text-slate-300 dark:ring-white/20 dark:hover:bg-white/10 dark:hover:text-white dark:hover:ring-white/30"
              >
                <span className="hero-arrow-path size-4 transition-transform duration-300 group-hover:-rotate-180"></span>
                <span className="hidden lg:inline">Restart game</span>
              </button>
            </div>

            {bombMessageShown && renderBombMessage(false)}

            {/* Share link (shown in online multiplayer mode) */}
            {game.playersNeeded > 1 && game.playMode === 'online' && (
              <div className="flex items-center gap-2 rounded-full bg-octo-mist p-1 pl-4 lg:order-3 text-sm ring-1 ring-octo-indigo/20 lg:flex-col lg:items-stretch lg:rounded-2xl lg:p-2 lg:pl-2 dark:bg-octo-indigo/15 dark:ring-octo-indigo-light/25">
                <input
                  id="memory-link"
                  readOnly
                  value={shareUrl}
                  className="min-w-0 flex-1 truncate bg-transparent text-octo-navy outline-none lg:px-2 lg:py-1 dark:text-slate-100"
                />
                <button
                  id="memory-copy-link"
                  type="button"
                  onClick={handleCopyLink}
                  className="cursor-pointer rounded-full bg-octo-indigo px-4 py-1.5 font-medium text-white transition hover:bg-octo-indigo/90 active:scale-95"
                >
                  {copied ? 'Copied!' : 'Copy link'}
                </button>
              </div>
            )}

            {/* Same-Device Pass & Play Active Turn Banner */}
            {game.players.length > 1 && !game.waiting && !game.finished && currentPlayer && (
              <div
                id="pass-and-play-banner"
                className="flex items-center justify-between gap-2 rounded-2xl bg-white px-3.5 py-2.5 text-sm shadow-sm ring-2 transition lg:order-3 dark:bg-white/5"
                style={{
                  borderColor: currentPlayer.color,
                  boxShadow: `0 0 0 2px ${currentPlayer.color}`,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-3.5 shrink-0 rounded-full animate-pulse"
                    style={{ background: currentPlayer.color }}
                  ></span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold leading-tight">
                      {getPlayerLabel(currentPlayer)}&apos;s Turn
                    </p>
                    <p className="text-xs opacity-60">
                      {game.demining
                        ? `Turn all bombs (${bombsUp}/${game.bombs})`
                        : `Flip ${flipsRemainingInTurn} ${
                            flipsRemainingInTurn === 1 ? 'more card' : 'cards'
                          }`}
                    </p>
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                  style={{ background: currentPlayer.color }}
                >
                  {game.playMode === 'local' ? 'Pass & Play' : game.playMode === 'bot' ? 'vs Bot' : 'Live'}
                </span>
              </div>
            )}

            {/* Multiplayer Scoreboard (#memory-scores) */}
            {game.players.length > 1 && (
              <ul id="memory-scores" className="flex flex-wrap gap-2 lg:order-4 lg:flex-col">
                {game.players.map((player) => {
                  const isCurrent =
                    game.turn === player.id && !game.waiting && !game.finished;
                  return (
                    <li
                      key={player.id}
                      id={`memory-score-${player.id}`}
                      style={{ '--player-color': player.color } as React.CSSProperties}
                      className={`relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-3 py-1 text-sm text-slate-800 shadow-sm ring-1 ring-slate-200 transition dark:bg-white/5 dark:text-slate-100 dark:shadow-none dark:ring-white/10 ${
                        player.away || player.dead ? 'opacity-50' : ''
                      } ${isCurrent ? 'memory-current' : ''}`}
                    >
                      <span
                        className="size-3 rounded-full"
                        style={{ background: player.color }}
                      ></span>
                      <span className={`lg:flex-1 ${player.dead ? 'line-through' : ''}`}>
                        {getPlayerLabel(player)}
                      </span>
                      {renderBadges(player)}
                      {isCurrent && (
                        <span
                          className="text-xs font-medium tracking-wide uppercase"
                          style={{ color: player.color }}
                        >
                          {game.demining ? 'demining' : 'turn'}
                        </span>
                      )}
                      <span className="font-semibold tabular-nums">{player.score}</span>
                      <span
                        id={`memory-accuracy-${player.id}`}
                        className="text-xs text-slate-400 tabular-nums"
                        title="Accuracy"
                      >
                        {formatAccuracy(player.accuracy)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            <a
              id="memory-leaderboards-link"
              href={game.campaign ? '/memory/campaign' : '/memory'}
              onClick={(e) => {
                e.preventDefault();
                if (game.campaign) onBackToCampaign();
                else onBackToSettings();
              }}
              className="hidden text-sm font-medium text-octo-indigo underline-offset-4 transition hover:underline lg:order-6 lg:block dark:text-octo-indigo-light"
            >
              {game.campaign ? 'Back to the map' : 'Best results'}
            </a>
          </aside>

          {/* Main Card Board */}
          <div className="min-w-0 flex-1">
            <div
              id="memory-board"
              style={{ width: fieldWidth }}
              className="relative mx-auto lg:rounded-2xl lg:bg-white lg:p-2 lg:shadow-sm lg:ring-1 lg:ring-slate-200 dark:lg:bg-white/5 dark:lg:shadow-none dark:lg:ring-white/10"
            >
              <div
                id="memory-field"
                className="grid"
                style={{
                  gap: `${gap}px`,
                  gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                }}
              >
                {fieldPlaces}
              </div>

              {game.waiting
                ? renderWaiting()
                : game.finished
                  ? game.campaign
                    ? renderCampaignResult()
                    : renderResult()
                  : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
