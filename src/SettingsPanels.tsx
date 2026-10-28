import { getAssetUrl } from "./svgAssets";
import React from 'react';
import {
  THEMES,
  PLAYER_COLORS,
  SetType,
  PlayMode,
  BotDifficulty,
  LeaderboardEntry,
  getAvailableCardCounts,
  getBombOptions,
  formatLeaderboardTime,
} from './gameEngine';

export interface LobbyGameSummary {
  id: string;
  theme: string;
  set: SetType;
  cards: number;
  campaignLevel?: number;
  playerName: string;
  score: number;
  finished: boolean;
}

interface LobbyProps {
  lobbyGames: LobbyGameSummary[];
  onOpenCampaign: () => void;
  onWatchGame: (item: LobbyGameSummary) => void;
}

export const LobbySection: React.FC<LobbyProps> = ({
  lobbyGames,
  onOpenCampaign,
  onWatchGame,
}) => (
  <div
    id="memory-lobby"
    className="mx-auto grid w-full max-w-md gap-4 lg:col-start-1 lg:row-start-2 xl:row-span-2 xl:row-start-1 xl:max-w-none"
  >
    <section
      id="lobby-games"
      className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold">
          <span className="hero-user-group size-4 text-octo-indigo"></span> Ongoing games
        </h3>
      </div>

      <ul id="lobby-games-list" className="-mx-2 space-y-1">
        {lobbyGames.map((item) => {
          const themeMeta = THEMES.find((t) => t.id === item.theme) || THEMES[1];
          return (
            <li
              key={item.id}
              id={`lobby-game-${item.id}`}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-base-200/60"
            >
              <img
                src={getAssetUrl(`/images/memory/${item.theme}/1.svg`)} data-card-theme={item.theme}
                alt=""
                className="size-9 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span className="line-clamp-2">
                    {item.campaignLevel ? (
                      <>
                        <a
                          href="/memory/campaign"
                          onClick={(e) => {
                            e.preventDefault();
                            onOpenCampaign();
                          }}
                          className="text-octo-indigo transition hover:underline dark:text-octo-indigo-light"
                        >
                          Campaign
                        </a>{' '}
                        · Level {item.campaignLevel} ·{' '}
                      </>
                    ) : null}
                    {themeMeta.label} · {item.set === 'triplets' ? 'Triplets' : 'Pairs'} ·{' '}
                    {item.cards} cards
                  </span>
                </p>
                <p className="flex flex-wrap gap-x-2.5 text-base-content/70 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full transition-colors bg-emerald-500"></span>
                    <span className={!item.finished ? 'font-semibold text-base-content' : ''}>
                      {item.playerName}
                    </span>
                    <span className="tabular-nums text-base-content/50">{item.score}</span>
                  </span>
                </p>
              </div>
              {item.finished ? (
                <span
                  id={`finished-${item.id}`}
                  className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
                >
                  Finished
                </span>
              ) : (
                <a
                  href={`/memory/${item.id}?watch=1`}
                  id={`watch-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onWatchGame(item);
                  }}
                  className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition hover:-translate-y-0.5 active:translate-y-0 text-octo-indigo ring-octo-indigo/30 hover:bg-octo-mist dark:text-octo-indigo-light dark:hover:bg-octo-indigo-light/10"
                >
                  Watch
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  </div>
);

interface LeaderboardsProps {
  yourResults: LeaderboardEntry[];
  bestResults: LeaderboardEntry[];
}

export const LeaderboardsSection: React.FC<LeaderboardsProps> = ({
  yourResults,
  bestResults,
}) => (
  <div
    id="memory-leaderboard"
    className="mx-auto grid w-full max-w-md gap-4 lg:col-start-2 lg:row-span-3 lg:row-start-1 xl:col-start-3 xl:row-span-2 xl:max-w-none"
  >
    <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="flex items-center gap-2 whitespace-nowrap font-semibold">
          <span className="hero-user size-4 text-octo-indigo"></span> Your results
        </h3>
      </div>
      <ol id="your-results" className="-mx-2 space-y-1 text-sm">
        {yourResults.length === 0 ? (
          <li className="py-2 text-center text-base-content/60">
            Complete a game to save your best times here.
          </li>
        ) : (
          yourResults.map((entry, idx) => (
            <li
              key={entry.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-base-200/60"
            >
              <span className="w-4 shrink-0 text-right tabular-nums text-base-content/40">
                {idx + 1}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{entry.name}</span>
              <span
                className="w-12 text-right tabular-nums text-base-content/60"
                title="Accuracy"
              >
                {entry.accuracy}%
              </span>
              <span className="min-w-16 shrink-0 rounded-full px-3 py-1 text-center text-xs font-semibold tabular-nums bg-base-content/5">
                {formatLeaderboardTime(entry.timeMs)}
              </span>
            </li>
          ))
        )}
      </ol>
    </div>

    <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className="flex items-center gap-2 whitespace-nowrap font-semibold">
          <span className="hero-trophy size-4 text-amber-500"></span> Best results
        </h3>
      </div>
      <ol id="best-results" className="-mx-2 space-y-1 text-sm">
        {bestResults.map((entry, idx) => (
          <li
            key={entry.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-base-200/60"
          >
            <span className="w-4 shrink-0 text-right tabular-nums text-base-content/40">
              {idx + 1}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">{entry.name}</span>
            <span
              className="w-12 text-right tabular-nums text-base-content/60"
              title="Accuracy"
            >
              {entry.accuracy}%
            </span>
            <span className="min-w-16 shrink-0 rounded-full px-3 py-1 text-center text-xs font-semibold tabular-nums bg-base-content/5">
              {formatLeaderboardTime(entry.timeMs)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

interface SettingsColumnProps {
  playersCount: number;
  playMode: PlayMode;
  botDifficulty: BotDifficulty;
  playerNames: [string, string, string, string];
  selectedTheme: string;
  selectedSet: SetType;
  effectiveCards: number;
  currentSliderIndex: number;
  availableCardCounts: number[];
  effectiveBombs: number;
  bombOptions: number[];
  visibility: 'public' | 'private';
  onChangePlayersCount: (n: number) => void;
  onChangePlayMode: (m: PlayMode) => void;
  onChangeBotDifficulty: (d: BotDifficulty) => void;
  onChangePlayerNames: (names: [string, string, string, string]) => void;
  onChangeTheme: (t: string, nextCards: number) => void;
  onChangeSet: (s: SetType, nextCards: number, nextBombs: number) => void;
  onChangeCards: (c: number) => void;
  onChangeBombs: (b: number) => void;
  onChangeVisibility: (v: 'public' | 'private') => void;
  onStartGame: () => void;
}

export const SettingsColumn: React.FC<SettingsColumnProps> = ({
  playersCount,
  playMode,
  botDifficulty,
  playerNames,
  selectedTheme,
  selectedSet,
  effectiveCards,
  currentSliderIndex,
  availableCardCounts,
  effectiveBombs,
  bombOptions,
  visibility,
  onChangePlayersCount,
  onChangePlayMode,
  onChangeBotDifficulty,
  onChangePlayerNames,
  onChangeTheme,
  onChangeSet,
  onChangeCards,
  onChangeBombs,
  onChangeVisibility,
  onStartGame,
}) => (
  <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center lg:sticky lg:top-8 lg:col-start-1 lg:row-start-3 xl:col-start-2 xl:row-start-2 xl:max-w-none">
    <div id="memory-settings" className="flex w-full flex-col gap-4">
      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="hero-users size-4 text-octo-indigo"></span> Players
        </h3>
        <div className="mt-3 flex justify-center">
          <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
            {[1, 2, 3, 4].map((num) => {
              const active = playersCount === num;
              return (
                <a
                  key={num}
                  href={`/memory?theme=${selectedTheme}&set=${selectedSet}&cards=${effectiveCards}&players=${num}`}
                  id={`players-${num}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangePlayersCount(num);
                  }}
                  className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-octo-indigo text-white shadow-sm'
                      : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                  }`}
                >
                  {num}
                </a>
              );
            })}
          </div>
        </div>

        {playersCount > 1 && (
          <div
            id="multiplayer-mode-box"
            className="mt-4 space-y-3 border-t border-base-300 pt-3.5 text-left"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                Play mode
              </span>
              <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
                {(
                  [
                    { id: 'local', label: 'Same device' },
                    { id: 'bot', label: 'vs AI Bot' },
                    { id: 'online', label: 'Share link' },
                  ] as const
                ).map((m) => {
                  const isCurrent = playMode === m.id;
                  return (
                    <button
                      key={m.id}
                      id={`mode-${m.id}`}
                      type="button"
                      aria-current={isCurrent ? 'true' : undefined}
                      onClick={() => onChangePlayMode(m.id)}
                      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition ${
                        isCurrent
                          ? 'bg-octo-indigo text-white shadow-sm'
                          : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {playMode === 'local' && (
              <div className="space-y-2">
                <p className="text-xs text-base-content/60">
                  Pass &amp; Play on this device: customize player names below.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: playersCount }).map((_, idx) => {
                    const color = PLAYER_COLORS[idx % PLAYER_COLORS.length];
                    return (
                      <div
                        key={`p-input-${idx}`}
                        className="flex items-center gap-2 rounded-xl bg-base-200/80 px-2.5 py-1.5 ring-1 ring-base-content/10 focus-within:ring-2 focus-within:ring-octo-indigo"
                      >
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{ background: color.hex }}
                        ></span>
                        <input
                          id={`player-name-${idx + 1}`}
                          type="text"
                          value={playerNames[idx]}
                          onChange={(e) => {
                            const copy = [...playerNames] as [string, string, string, string];
                            copy[idx] = e.target.value;
                            onChangePlayerNames(copy);
                          }}
                          placeholder={`Player ${idx + 1}`}
                          aria-label={`Player ${idx + 1} name`}
                          className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {playMode === 'bot' && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs text-base-content/60">Bot memory skill</span>
                <div className="flex gap-1 rounded-full bg-base-200 p-1">
                  {(['easy', 'normal', 'smart'] as const).map((diff) => (
                    <button
                      key={diff}
                      id={`bot-${diff}`}
                      type="button"
                      onClick={() => onChangeBotDifficulty(diff)}
                      className={`cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium capitalize transition ${
                        botDifficulty === diff
                          ? 'bg-octo-indigo text-white shadow-sm'
                          : 'text-base-content/70 hover:bg-base-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="hero-swatch size-4 text-octo-indigo"></span> Theme
        </h3>
        <div className="memory-themes-box">
          <div
            id="memory-themes"
            className="memory-themes grid grid-cols-4 gap-3 xl:grid-cols-6"
          >
            {THEMES.map((theme) => {
              const active = selectedTheme === theme.id;
              return (
                <a
                  key={theme.id}
                  href={`/memory?theme=${theme.id}&set=${selectedSet}&cards=${effectiveCards}&players=${playersCount}`}
                  id={`theme-${theme.id}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    const nextValid = getAvailableCardCounts(theme.id, selectedSet);
                    const nextCards = nextValid.includes(effectiveCards)
                      ? effectiveCards
                      : nextValid[Math.min(nextValid.length - 1, currentSliderIndex)] ||
                        nextValid[0];
                    onChangeTheme(theme.id, nextCards);
                  }}
                  className={`group relative flex flex-col items-center gap-1 rounded-xl p-1.5 transition ${
                    active
                      ? 'bg-octo-mist ring-2 ring-octo-indigo dark:bg-octo-indigo-light/10'
                      : 'ring-1 ring-base-content/5 hover:bg-base-200 hover:ring-base-content/15'
                  }`}
                >
                  {theme.isNew && (
                    <span
                      id={`theme-${theme.id}-new`}
                      className="absolute -top-1.5 -right-1.5 z-10 rounded-full bg-octo-orange px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-white shadow-sm"
                    >
                      New
                    </span>
                  )}
                  {theme.isAI && (
                    <span
                      id={`theme-${theme.id}-ai`}
                      className="absolute -top-1.5 -right-1.5 z-10 rounded-full bg-octo-indigo px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-wide text-white shadow-sm"
                    >
                      AI
                    </span>
                  )}
                  <img
                    src={getAssetUrl(theme.previewUrl)} data-card-theme={theme.id}
                    alt=""
                    className={`aspect-square w-full p-1 transition ${
                      theme.id === 'random'
                        ? 'duration-300 group-hover:scale-105 group-hover:-rotate-6'
                        : 'group-hover:scale-105'
                    }`}
                  />
                  <span className="w-full truncate text-xs text-base-content/70">
                    {theme.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="hero-magnifying-glass size-4 text-octo-indigo"></span> Look for
        </h3>
        <div className="mt-3 flex justify-center">
          <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
            {(['pairs', 'triplets'] as const).map((st) => {
              const active = selectedSet === st;
              return (
                <a
                  key={st}
                  href={`/memory?theme=${selectedTheme}&set=${st}&cards=${effectiveCards}&players=${playersCount}`}
                  id={`set-${st}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    const nextValid = getAvailableCardCounts(selectedTheme, st);
                    const nextCards = nextValid[0];
                    const nextBombOpts = getBombOptions(st);
                    const nextBombs = nextBombOpts.includes(effectiveBombs)
                      ? effectiveBombs
                      : 0;
                    onChangeSet(st, nextCards, nextBombs);
                  }}
                  className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-octo-indigo text-white shadow-sm'
                      : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                  }`}
                >
                  {st === 'pairs' ? 'Pairs' : 'Triplets'}
                </a>
              );
            })}
          </div>
        </div>
        <p className="mt-1.5 text-left text-xs text-base-content/50">
          {selectedSet === 'pairs'
            ? 'Find 2 cards with the same image.'
            : 'Find 3 cards with the same image.'}
        </p>
      </div>

      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="hero-squares-2x2 size-4 text-octo-indigo"></span> Cards
        </h3>
        <div className="mt-3 flex justify-center">
          <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1 w-full">
            {currentSliderIndex <= 0 ? (
              <span
                id="cards-less"
                aria-disabled="true"
                className="grid size-9 place-items-center rounded-full text-base-content/20"
              >
                <span className="hero-minus size-4"></span>
              </span>
            ) : (
              <a
                href={`/memory?theme=${selectedTheme}&set=${selectedSet}&cards=${
                  availableCardCounts[currentSliderIndex - 1]
                }&players=${playersCount}`}
                id="cards-less"
                aria-label="Fewer cards"
                onClick={(e) => {
                  e.preventDefault();
                  onChangeCards(availableCardCounts[currentSliderIndex - 1]);
                }}
                className="grid size-9 place-items-center rounded-full text-base-content/70 transition hover:bg-base-100 hover:text-base-content active:scale-90"
              >
                <span className="hero-minus size-4"></span>
              </a>
            )}

            <form
              id="cards-form"
              className="flex flex-1 items-center"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="range"
                id="cards-slider"
                name="index"
                aria-label="Cards"
                min={0}
                max={Math.max(0, availableCardCounts.length - 1)}
                value={currentSliderIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  onChangeCards(availableCardCounts[idx] ?? availableCardCounts[0]);
                }}
                className="w-full cursor-pointer accent-octo-indigo outline-none"
              />
            </form>

            <span
              id="cards-count"
              className="min-w-10 self-center text-center text-sm font-semibold tabular-nums"
            >
              {effectiveCards}
            </span>

            {currentSliderIndex >= availableCardCounts.length - 1 ? (
              <span
                id="cards-more"
                aria-disabled="true"
                className="grid size-9 place-items-center rounded-full text-base-content/20"
              >
                <span className="hero-plus size-4"></span>
              </span>
            ) : (
              <a
                href={`/memory?theme=${selectedTheme}&set=${selectedSet}&cards=${
                  availableCardCounts[currentSliderIndex + 1]
                }&players=${playersCount}`}
                id="cards-more"
                aria-label="More cards"
                onClick={(e) => {
                  e.preventDefault();
                  onChangeCards(availableCardCounts[currentSliderIndex + 1]);
                }}
                className="grid size-9 place-items-center rounded-full text-base-content/70 transition hover:bg-base-100 hover:text-base-content active:scale-90"
              >
                <span className="hero-plus size-4"></span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="icon-bomb size-4 text-octo-indigo"></span> Bombs
          <span
            id="bombs-new"
            className="rounded-full bg-octo-orange px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wide text-white uppercase shadow-sm"
          >
            New
          </span>
        </h3>
        <div className="mt-3 flex justify-center">
          <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
            {bombOptions.map((b) => {
              const active = effectiveBombs === b;
              return (
                <a
                  key={b}
                  href={`/memory?theme=${selectedTheme}&set=${selectedSet}&cards=${effectiveCards}&players=${playersCount}${
                    b > 0 ? `&bombs=${b}` : ''
                  }`}
                  id={`bombs-${b}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangeBombs(b);
                  }}
                  className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-octo-indigo text-white shadow-sm'
                      : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                  }`}
                >
                  {b === 0 ? 'None' : b}
                </a>
              );
            })}
          </div>
        </div>
        {effectiveBombs > 0 && (
          <p className="mt-1.5 text-left text-xs text-base-content/50">
            Turn a bomb that was seen, and you are out.
          </p>
        )}
      </div>

      <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
        <h3 className="flex items-center gap-2 text-left font-semibold">
          <span className="hero-eye size-4 text-octo-indigo"></span> Visibility
        </h3>
        <div className="mt-3 flex justify-center">
          <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
            {(['public', 'private'] as const).map((vis) => {
              const active = visibility === vis;
              return (
                <a
                  key={vis}
                  href={`/memory?theme=${selectedTheme}&set=${selectedSet}&cards=${effectiveCards}&players=${playersCount}${
                    vis === 'private' ? '&visibility=private' : ''
                  }`}
                  id={`visibility-${vis}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onChangeVisibility(vis);
                  }}
                  className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    active
                      ? 'bg-octo-indigo text-white shadow-sm'
                      : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                  }`}
                >
                  {vis === 'public' ? 'Public' : 'Private'}
                </a>
              );
            })}
          </div>
        </div>
        <p className="mt-1.5 text-left text-xs text-base-content/50">
          {visibility === 'public'
            ? 'Other players can watch this game in Ongoing games.'
            : 'Only people with the link can join or watch this game.'}
        </p>
      </div>
    </div>

    <div
      id="new-game-bar"
      className="pointer-events-none sticky bottom-0 z-10 -mx-2 -mt-6 flex w-[calc(100%+1rem)] flex-col items-center gap-2 bg-linear-to-t from-base-100 from-70% to-transparent pt-8 pb-5"
    >
      <button
        id="new-game"
        type="button"
        onClick={onStartGame}
        className="pointer-events-auto cursor-pointer rounded-full px-8 py-3 font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 bg-octo-indigo shadow-octo-indigo/25 hover:bg-octo-indigo/90"
      >
        Start game
      </button>
    </div>
  </div>
);
