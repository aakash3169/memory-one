import React, { useEffect, useRef, useState } from 'react';
import {
  THEMES,
  CAMPAIGN_LEVELS,
  PLAYER_COLORS,
  DEFAULT_BEST_RESULTS,
  DEFAULT_CAMPAIGN_LEADERS,
  SetType,
  PlayMode,
  BotDifficulty,
  MemoryGameState,
  LeaderboardEntry,
  getAvailableCardCounts,
  getBombOptions,
  createGame,
  flipCard,
  chooseBotCardIndex,
} from './gameEngine';
import { playMemorySound, unlockAudio } from './sound';
import {
  SiteHeader,
  SiteFooter,
  RulesModal,
  CampaignMapSection,
  ThemeMode,
} from './HeaderFooter';
import {
  LobbyGameSummary,
  LobbySection,
  LeaderboardsSection,
  SettingsColumn,
} from './SettingsPanels';
import { GameRoom } from './GameRoom';

type RouteView = 'free' | 'campaign' | 'room';

const INITIAL_LOBBY_GAMES: LobbyGameSummary[] = [
  {
    id: 'RNQV9_8_',
    theme: 'space',
    set: 'pairs',
    cards: 36,
    campaignLevel: 11,
    playerName: 'Qwerbalken',
    score: 16,
    finished: false,
  },
  {
    id: '0-F5wsE-',
    theme: 'flowers',
    set: 'pairs',
    cards: 16,
    playerName: 'Dizzy Plankton',
    score: 0,
    finished: false,
  },
  {
    id: '7qlnDsS7',
    theme: 'music',
    set: 'pairs',
    cards: 16,
    playerName: 'Polite Seahorse',
    score: 16,
    finished: true,
  },
  {
    id: 'jy6jpNh8',
    theme: 'eighties',
    set: 'pairs',
    cards: 40,
    playerName: 'Brave Sponge',
    score: 40,
    finished: true,
  },
];

export const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('phx:theme') as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch {}
    return 'system';
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const isDark = themeMode === 'dark' || (themeMode === 'system' && media.matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme-mode', themeMode);
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [themeMode]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem('phx:theme', mode);
    } catch {}
  };

  const [guestName, setGuestName] = useState<string>(() => {
    try {
      return localStorage.getItem('octo:guestName') || 'Player 1';
    } catch {
      return 'Player 1';
    }
  });

  const handleSetGuestName = (name: string) => {
    setGuestName(name);
    try {
      localStorage.setItem('octo:guestName', name);
    } catch {}
    setPlayerNames((prev) => [name, prev[1], prev[2], prev[3]]);
  };

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('memory-muted') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMuted = () => {
    setMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('memory-muted', String(next));
      } catch {}
      return next;
    });
  };

  const initialParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/memory';

  const [playersCount, setPlayersCount] = useState<number>(() => {
    const p = Number(initialParams.get('players'));
    return p >= 1 && p <= 4 ? p : 1;
  });

  const [playMode, setPlayMode] = useState<PlayMode>(() => {
    const m = initialParams.get('mode');
    if (m === 'bot' || m === 'online' || m === 'local') return m;
    return 'local';
  });

  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('normal');

  const [playerNames, setPlayerNames] = useState<[string, string, string, string]>(() => [
    guestName || 'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);

  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    const t = initialParams.get('theme');
    return THEMES.some((x) => x.id === t) ? t! : 'random';
  });

  const [selectedSet, setSelectedSet] = useState<SetType>(() => {
    return initialParams.get('set') === 'triplets' ? 'triplets' : 'pairs';
  });

  const [selectedCards, setSelectedCards] = useState<number>(() => {
    const c = Number(initialParams.get('cards'));
    const valid = getAvailableCardCounts(selectedTheme, selectedSet);
    return valid.includes(c) ? c : valid[0];
  });

  const [selectedBombs, setSelectedBombs] = useState<number>(() => {
    const b = Number(initialParams.get('bombs'));
    const valid = getBombOptions(selectedSet);
    return valid.includes(b) ? b : 0;
  });

  const [visibility, setVisibility] = useState<'public' | 'private'>(() => {
    return initialParams.get('visibility') === 'private' ? 'private' : 'public';
  });

  const availableCardCounts = getAvailableCardCounts(selectedTheme, selectedSet);
  const currentSliderIndex = Math.max(0, availableCardCounts.indexOf(selectedCards));
  const effectiveCards = availableCardCounts[currentSliderIndex] ?? availableCardCounts[0];
  const bombOptions = getBombOptions(selectedSet);
  const effectiveBombs = bombOptions.includes(selectedBombs) ? selectedBombs : 0;

  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    try {
      return Math.max(1, Number(localStorage.getItem('octo:campaignUnlocked')) || 1);
    } catch {
      return 1;
    }
  });
  const [unlockAllCampaign, setUnlockAllCampaign] = useState<boolean>(false);
  const [selectedCampaignLevel, setSelectedCampaignLevel] = useState<number>(() => {
    const lvl = Number(initialParams.get('level'));
    return lvl >= 1 && lvl <= CAMPAIGN_LEVELS.length ? lvl : 1;
  });
  const [campaignCompletedTimes, setCampaignCompletedTimes] = useState<Record<number, number>>(
    () => {
      try {
        return JSON.parse(localStorage.getItem('octo:campaignTimes') || '{}');
      } catch {
        return {};
      }
    }
  );

  const [yourResults, setYourResults] = useState<LeaderboardEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('octo:yourResults') || '[]');
    } catch {
      return [];
    }
  });

  const [bestResults, setBestResults] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('octo:bestResults') || 'null');
      return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_BEST_RESULTS;
    } catch {
      return DEFAULT_BEST_RESULTS;
    }
  });

  const [lobbyGames, setLobbyGames] = useState<LobbyGameSummary[]>(INITIAL_LOBBY_GAMES);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);

  const [route, setRoute] = useState<RouteView>(() => {
    if (initialPath.startsWith('/memory/campaign')) return 'campaign';
    return 'free';
  });
  const [activeGame, setActiveGame] = useState<MemoryGameState | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel('octomocto-memory-sync');
    channelRef.current = ch;
    ch.onmessage = (ev) => {
      const msg = ev.data;
      if (msg?.type === 'GAME_STATE' && msg.game) {
        setActiveGame((curr) => (curr && curr.id === msg.game.id ? msg.game : curr));
      }
    };
    return () => ch.close();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRulesOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onPointer = () => unlockAudio();
    window.addEventListener('pointerdown', onPointer, { once: true });
    return () => window.removeEventListener('pointerdown', onPointer);
  }, []);

  const syncSettingsUrl = (
    nextRoute: RouteView,
    theme = selectedTheme,
    set = selectedSet,
    cards = effectiveCards,
    players = playersCount,
    bombs = effectiveBombs,
    vis = visibility
  ) => {
    if (typeof window === 'undefined') return;
    if (nextRoute === 'campaign') {
      window.history.pushState({}, '', '/memory/campaign');
    } else if (nextRoute === 'free') {
      const params = new URLSearchParams();
      params.set('theme', theme);
      params.set('set', set);
      params.set('cards', String(cards));
      params.set('players', String(players));
      if (bombs > 0) params.set('bombs', String(bombs));
      if (vis === 'private') params.set('visibility', 'private');
      window.history.pushState({}, '', `/memory?${params.toString()}`);
    }
  };

  const handleStartFreeGame = () => {
    unlockAudio();
    const names = playerNames.map((n, idx) =>
      idx === 0 ? n.trim() || guestName : n.trim() || `Player ${idx + 1}`
    );
    const game = createGame({
      theme: selectedTheme,
      set: selectedSet,
      cardsCount: effectiveCards,
      playersCount,
      playMode: playersCount > 1 ? playMode : 'local',
      botDifficulty,
      playerNames: names,
      playerColors: PLAYER_COLORS.slice(0, 4),
      bombs: effectiveBombs,
      visibility,
    });
    setActiveGame(game);
    setRoute('room');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/memory/${game.id}`);
    }
    if (playersCount > 1 && !game.waiting) {
      playMemorySound('start', muted);
    }
  };

  const handleStartCampaignLevel = (level: number) => {
    unlockAudio();
    const game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 16,
      playersCount: 1,
      campaignLevel: level,
    });
    setSelectedCampaignLevel(level);
    setActiveGame(game);
    setRoute('room');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/memory/${game.id}`);
    }
  };

  const handleWatchLobbyGame = (item: LobbyGameSummary) => {
    unlockAudio();
    const game = createGame({
      id: item.id,
      theme: item.theme,
      set: item.set,
      cardsCount: item.cards,
      playersCount: 1,
      playerNames: [item.playerName],
      campaignLevel: item.campaignLevel ?? null,
    });
    setActiveGame(game);
    setRoute('room');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/memory/${game.id}`);
    }
  };

  const handleGameFinishedSideEffects = (finishedGame: MemoryGameState) => {
    if (finishedGame.campaign) {
      if (!finishedGame.failed) {
        const lvl = finishedGame.campaign.level;
        const nextUnlocked = Math.min(
          CAMPAIGN_LEVELS.length,
          Math.max(unlockedLevel, lvl + 1)
        );
        setUnlockedLevel(nextUnlocked);
        try {
          localStorage.setItem('octo:campaignUnlocked', String(nextUnlocked));
        } catch {}

        setCampaignCompletedTimes((prev) => {
          const best = prev[lvl]
            ? Math.min(prev[lvl], finishedGame.elapsedMs)
            : finishedGame.elapsedMs;
          const updated = { ...prev, [lvl]: best };
          try {
            localStorage.setItem('octo:campaignTimes', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
      return;
    }

    if (!finishedGame.failed) {
      const winner = [...finishedGame.players].sort((a, b) => b.score - a.score)[0];
      const entry: LeaderboardEntry = {
        id: finishedGame.id + '-' + Date.now(),
        name: winner?.name || guestName,
        accuracy: winner?.accuracy ?? 100,
        timeMs: Math.max(500, finishedGame.elapsedMs),
        theme: finishedGame.randomTheme ? 'random' : finishedGame.theme,
        set: finishedGame.set === 3 ? 'triplets' : 'pairs',
        cards: finishedGame.cardsCount,
        bombs: finishedGame.bombs,
        date: new Date().toISOString().slice(0, 10),
      };

      setYourResults((prev) => {
        const next = [entry, ...prev].sort((a, b) => a.timeMs - b.timeMs).slice(0, 10);
        try {
          localStorage.setItem('octo:yourResults', JSON.stringify(next));
        } catch {}
        return next;
      });

      setBestResults((prev) => {
        const next = [entry, ...prev].sort((a, b) => a.timeMs - b.timeMs).slice(0, 10);
        try {
          localStorage.setItem('octo:bestResults', JSON.stringify(next));
        } catch {}
        return next;
      });

      setLobbyGames((prev) => [
        {
          id: finishedGame.id,
          theme: finishedGame.theme,
          set: finishedGame.set === 3 ? 'triplets' : 'pairs',
          cards: finishedGame.cardsCount,
          playerName: winner?.name || guestName,
          score: winner?.score ?? finishedGame.cardsCount,
          finished: true,
        },
        ...prev.slice(0, 5),
      ]);
    }
  };

  const handleFlipCard = (cardIndex: number) => {
    setActiveGame((prev) => {
      if (!prev) return prev;
      const outcome = flipCard(prev, cardIndex, Date.now());
      for (const s of outcome.sounds) {
        playMemorySound(s, muted);
      }
      if (!prev.finished && outcome.state.finished) {
        handleGameFinishedSideEffects(outcome.state);
      }
      channelRef.current?.postMessage({ type: 'GAME_STATE', game: outcome.state });
      return outcome.state;
    });
  };

  useEffect(() => {
    if (!activeGame || activeGame.waiting || activeGame.finished) return;
    if (activeGame.playMode !== 'bot') return;
    const currentPlayer = activeGame.players.find((p) => p.id === activeGame.turn);
    if (!currentPlayer?.isBot) return;

    const delayMs = activeGame.ongoing ? 650 : 900;
    const timer = window.setTimeout(() => {
      const botPick = chooseBotCardIndex(activeGame);
      if (botPick !== null) {
        handleFlipCard(botPick);
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [activeGame]);

  const handleRestartGame = () => {
    if (!activeGame) return;
    if (activeGame.campaign) {
      handleStartCampaignLevel(activeGame.campaign.level);
    } else {
      const names = activeGame.players.map((p, i) => p.name || `Player ${i + 1}`);
      const restarted = createGame({
        id: activeGame.id,
        theme: activeGame.randomTheme ? 'random' : activeGame.theme,
        set: activeGame.set === 3 ? 'triplets' : 'pairs',
        cardsCount: activeGame.cardsCount,
        playersCount: activeGame.playersNeeded,
        playMode: activeGame.playMode,
        botDifficulty: activeGame.botDifficulty,
        playerNames: names,
        bombs: activeGame.bombs,
        visibility: activeGame.visibility,
      });
      setActiveGame(restarted);
      if (restarted.players.length > 1 && !restarted.waiting) {
        playMemorySound('start', muted);
      }
    }
  };

  const handleNextCampaignLevel = () => {
    if (!activeGame?.campaign) return;
    const nextLvl = Math.min(CAMPAIGN_LEVELS.length, activeGame.campaign.level + 1);
    handleStartCampaignLevel(nextLvl);
  };

  const handleSwitchWaitingToLocal = () => {
    if (!activeGame) return;
    const names = playerNames.map((n, idx) =>
      idx === 0 ? n.trim() || guestName : n.trim() || `Player ${idx + 1}`
    );
    const localGame = createGame({
      id: activeGame.id,
      theme: activeGame.randomTheme ? 'random' : activeGame.theme,
      set: activeGame.set === 3 ? 'triplets' : 'pairs',
      cardsCount: activeGame.cardsCount,
      playersCount: activeGame.playersNeeded,
      playMode: 'local',
      playerNames: names,
      bombs: activeGame.bombs,
      visibility: activeGame.visibility,
    });
    setPlayMode('local');
    setActiveGame(localGame);
    playMemorySound('start', muted);
  };

  if (route === 'room' && activeGame) {
    return (
      <div className="flex min-h-dvh flex-col">
        <GameRoom
          game={activeGame}
          muted={muted}
          onToggleMuted={handleToggleMuted}
          onFlipCard={handleFlipCard}
          onRestart={handleRestartGame}
          onNextLevel={handleNextCampaignLevel}
          onBackToSettings={() => {
            setRoute('free');
            syncSettingsUrl('free');
          }}
          onBackToCampaign={() => {
            setRoute('campaign');
            syncSettingsUrl('campaign');
          }}
          onSwitchWaitingToLocal={handleSwitchWaitingToLocal}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        guestName={guestName}
        onChangeGuestName={handleSetGuestName}
        themeMode={themeMode}
        onChangeThemeMode={handleSetThemeMode}
        onNavigateHome={() => {
          setRoute('free');
          syncSettingsUrl('free');
        }}
      />

      <main className="flex-1 px-4 pb-6 sm:px-6 lg:px-8">
        <div className="space-y-4 mx-auto max-w-2xl">
          <div
            id="memory-index"
            className="relative left-1/2 grid w-[min(96vw,51rem)] -translate-x-1/2 gap-6 pt-4 pb-12 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:items-start lg:gap-x-12 lg:pt-6 lg:pb-16 xl:w-[calc(100vw-4rem)] xl:grid-cols-[1fr_1.4fr_1fr] xl:grid-rows-[auto_1fr]"
          >
            <div className="mx-auto w-full max-w-md space-y-2 text-center lg:col-start-1 lg:row-start-1 xl:col-start-2 xl:max-w-none">
              <div className="flex items-center justify-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-octo-indigo/10 shadow-inner">
                  <svg viewBox="0 0 48 48" className="size-9" aria-hidden="true">
                    <g transform="rotate(-10 15 26)">
                      <rect
                        x="5"
                        y="12"
                        width="20"
                        height="28"
                        rx="3.5"
                        fill="#fff"
                        stroke="#0EA5E9"
                        strokeOpacity="0.35"
                        strokeWidth="1.5"
                      ></rect>
                      <path
                        transform="translate(15 26)"
                        d="M0-7.5l2.2 4.6 5 .6-3.7 3.5.9 5L0 3.8l-4.4 2.4.9-5-3.7-3.5 5-.6z"
                        fill="#F26A1B"
                      ></path>
                    </g>
                    <g transform="rotate(10 33 26)">
                      <rect
                        x="23"
                        y="12"
                        width="20"
                        height="28"
                        rx="3.5"
                        fill="#fff"
                        stroke="#0EA5E9"
                        strokeOpacity="0.35"
                        strokeWidth="1.5"
                      ></rect>
                      <path
                        transform="translate(33 26)"
                        d="M0-7.5l2.2 4.6 5 .6-3.7 3.5.9 5L0 3.8l-4.4 2.4.9-5-3.7-3.5 5-.6z"
                        fill="#F26A1B"
                      ></path>
                    </g>
                  </svg>
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">Memory</h1>
              </div>

              <p className="text-base-content/70">
                {route === 'campaign'
                  ? 'Get 100% accuracy to unlock the next level.'
                  : 'Choose the settings and start a new game.'}
              </p>

              <button
                id="how-to-play"
                type="button"
                onClick={() => setRulesOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium transition text-octo-indigo hover:text-octo-indigo/80"
              >
                <span className="hero-question-mark-circle size-4"></span> How to play
              </button>

              <div className="pt-2">
                <nav id="campaign-tabs" className="flex justify-center">
                  <div className="option-slider flex gap-1 rounded-full bg-base-200 p-1">
                    <a
                      href="/memory"
                      id="tab-free"
                      aria-current={route === 'free' ? 'true' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        setRoute('free');
                        syncSettingsUrl('free');
                      }}
                      className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                        route === 'free'
                          ? 'bg-octo-indigo text-white shadow-sm'
                          : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                      }`}
                    >
                      Free play
                    </a>

                    <span className="relative">
                      <a
                        href="/memory/campaign"
                        id="tab-campaign"
                        aria-current={route === 'campaign' ? 'true' : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          setRoute('campaign');
                          syncSettingsUrl('campaign');
                        }}
                        className={`min-w-10 rounded-full px-4 py-1.5 text-sm font-medium transition block ${
                          route === 'campaign'
                            ? 'bg-octo-indigo text-white shadow-sm'
                            : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                        }`}
                      >
                        Campaign
                      </a>
                      <span
                        id="tab-campaign-new"
                        className="pointer-events-none absolute -top-2.5 -right-2.5 z-10 rounded-full bg-octo-orange px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-wide text-white uppercase shadow-sm"
                      >
                        New
                      </span>
                    </span>
                  </div>
                </nav>
              </div>
            </div>

            {route === 'free' ? (
              <>
                <LobbySection
                  lobbyGames={lobbyGames}
                  onOpenCampaign={() => {
                    setRoute('campaign');
                    syncSettingsUrl('campaign');
                  }}
                  onWatchGame={handleWatchLobbyGame}
                />

                <SettingsColumn
                  playersCount={playersCount}
                  playMode={playMode}
                  botDifficulty={botDifficulty}
                  playerNames={playerNames}
                  selectedTheme={selectedTheme}
                  selectedSet={selectedSet}
                  effectiveCards={effectiveCards}
                  currentSliderIndex={currentSliderIndex}
                  availableCardCounts={availableCardCounts}
                  effectiveBombs={effectiveBombs}
                  bombOptions={bombOptions}
                  visibility={visibility}
                  onChangePlayersCount={(num) => {
                    setPlayersCount(num);
                    syncSettingsUrl(
                      'free',
                      selectedTheme,
                      selectedSet,
                      effectiveCards,
                      num,
                      effectiveBombs,
                      visibility
                    );
                  }}
                  onChangePlayMode={setPlayMode}
                  onChangeBotDifficulty={setBotDifficulty}
                  onChangePlayerNames={setPlayerNames}
                  onChangeTheme={(themeId, nextCards) => {
                    setSelectedTheme(themeId);
                    setSelectedCards(nextCards);
                    syncSettingsUrl(
                      'free',
                      themeId,
                      selectedSet,
                      nextCards,
                      playersCount,
                      effectiveBombs,
                      visibility
                    );
                  }}
                  onChangeSet={(st, nextCards, nextBombs) => {
                    setSelectedSet(st);
                    setSelectedCards(nextCards);
                    setSelectedBombs(nextBombs);
                    syncSettingsUrl(
                      'free',
                      selectedTheme,
                      st,
                      nextCards,
                      playersCount,
                      nextBombs,
                      visibility
                    );
                  }}
                  onChangeCards={(nextC) => {
                    setSelectedCards(nextC);
                    syncSettingsUrl(
                      'free',
                      selectedTheme,
                      selectedSet,
                      nextC,
                      playersCount,
                      effectiveBombs,
                      visibility
                    );
                  }}
                  onChangeBombs={(b) => {
                    setSelectedBombs(b);
                    syncSettingsUrl(
                      'free',
                      selectedTheme,
                      selectedSet,
                      effectiveCards,
                      playersCount,
                      b,
                      visibility
                    );
                  }}
                  onChangeVisibility={(vis) => {
                    setVisibility(vis);
                    syncSettingsUrl(
                      'free',
                      selectedTheme,
                      selectedSet,
                      effectiveCards,
                      playersCount,
                      effectiveBombs,
                      vis
                    );
                  }}
                  onStartGame={handleStartFreeGame}
                />

                <LeaderboardsSection
                  yourResults={yourResults}
                  bestResults={bestResults}
                />
              </>
            ) : (
              <>
                <CampaignMapSection
                  unlockedLevel={unlockedLevel}
                  selectedLevel={selectedCampaignLevel}
                  unlockAll={unlockAllCampaign}
                  completedTimes={campaignCompletedTimes}
                  onSelectLevel={(lvl) => setSelectedCampaignLevel(lvl)}
                  onStartLevel={(lvl) => handleStartCampaignLevel(lvl)}
                  onToggleUnlockAll={() => setUnlockAllCampaign((prev) => !prev)}
                />

                <div
                  id="campaign-results"
                  className="mx-auto grid w-full max-w-md gap-4 lg:col-start-2 lg:row-span-3 lg:row-start-1 xl:col-start-3 xl:row-span-2 xl:max-w-none"
                >
                  <div className="rounded-2xl bg-base-100 p-5 shadow-sm ring-1 ring-base-content/10">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <h3 className="flex items-center gap-2 whitespace-nowrap font-semibold">
                        <span className="hero-trophy size-4 text-amber-500"></span> Highest levels
                      </h3>
                    </div>
                    <ol id="campaign-leaderboard" className="-mx-2 space-y-1 text-sm">
                      {DEFAULT_CAMPAIGN_LEADERS.map((leader, idx) => (
                        <li
                          key={leader.name}
                          className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-base-200/60"
                        >
                          <span className="w-4 shrink-0 text-right tabular-nums text-base-content/40">
                            {idx + 1}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {leader.name}
                          </span>
                          <span className="min-w-16 shrink-0 rounded-full px-3 py-1 text-center text-xs font-semibold tabular-nums bg-base-content/5">
                            Level {leader.level}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </>
            )}
          </div>

          <RulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
