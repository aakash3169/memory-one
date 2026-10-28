import { MemorySoundName } from './sound';

export type SetType = 'pairs' | 'triplets';
export type PlayMode = 'local' | 'bot' | 'online';
export type BotDifficulty = 'easy' | 'normal' | 'smart';

export interface ThemeInfo {
  id: string;
  label: string;
  previewUrl: string;
  imageCount: number;
  isNew?: boolean;
  isAI?: boolean;
}

export const THEMES: ThemeInfo[] = [
  { id: 'random', label: 'Random', previewUrl: '/images/memory/random.svg', imageCount: 100, isNew: true },
  { id: 'sushi', label: 'Sushi', previewUrl: '/images/memory/sushi/2.svg', imageCount: 50 },
  { id: 'food', label: 'Food', previewUrl: '/images/memory/food/31.svg', imageCount: 100 },
  { id: 'desert', label: 'Desert', previewUrl: '/images/memory/desert/1.svg', imageCount: 50 },
  { id: 'ocean', label: 'Ocean', previewUrl: '/images/memory/ocean/11.svg', imageCount: 50 },
  { id: 'monsters', label: 'Monsters', previewUrl: '/images/memory/monsters/4.svg', imageCount: 100 },
  { id: 'insects', label: 'Insects', previewUrl: '/images/memory/insects/1.svg', imageCount: 50 },
  { id: 'eighties', label: 'Eighties', previewUrl: '/images/memory/eighties/1.svg', imageCount: 40 },
  { id: 'spring', label: 'Spring', previewUrl: '/images/memory/spring/1.svg', imageCount: 38 },
  { id: 'flowers', label: 'Flowers', previewUrl: '/images/memory/flowers/1.svg', imageCount: 50 },
  { id: 'birds', label: 'Birds', previewUrl: '/images/memory/birds/1.svg', imageCount: 49 },
  { id: 'pets', label: 'Pets', previewUrl: '/images/memory/pets/1.svg', imageCount: 50 },
  { id: 'animals', label: 'Animals', previewUrl: '/images/memory/animals/1.svg', imageCount: 50 },
  { id: 'fairy_tales', label: 'Fairy Tales', previewUrl: '/images/memory/fairy_tales/1.svg', imageCount: 50 },
  { id: 'music', label: 'Music', previewUrl: '/images/memory/music/1.svg', imageCount: 50 },
  { id: 'halloween', label: 'Halloween', previewUrl: '/images/memory/halloween/1.svg', imageCount: 48 },
  { id: 'flags', label: 'Flags', previewUrl: '/images/memory/flags/49.svg', imageCount: 50 },
  { id: 'cats', label: 'Cats', previewUrl: '/images/memory/cats/1.svg', imageCount: 50 },
  { id: 'space', label: 'Space', previewUrl: '/images/memory/space/1.svg', imageCount: 50 },
  { id: 'ai_studio', label: 'AI Studio', previewUrl: '/images/memory/ai_studio/1.svg', imageCount: 8, isAI: true },
];

export const CONCRETE_THEMES = THEMES.filter((t) => t.id !== 'random' && t.id !== 'ai_studio');

export const VALID_PAIRS_CARDS = [
  16, 18, 20, 24, 26, 28, 30, 32, 34, 36, 40, 42, 44, 48, 50, 54, 56, 60, 62, 64, 66, 70, 72, 74, 76, 78, 80, 84, 88, 90, 96, 98, 100,
];

export const VALID_TRIPLETS_CARDS = [
  15, 18, 21, 24, 27, 30, 36, 42, 45, 48, 54, 60, 63, 66, 72, 75, 78, 81, 84, 90, 96, 99,
];

export function getAvailableCardCounts(themeId: string, set: SetType): number[] {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const setSize = set === 'pairs' ? 2 : 3;
  const maxByTheme = theme.imageCount * setSize;
  const baseList = set === 'pairs' ? VALID_PAIRS_CARDS : VALID_TRIPLETS_CARDS;
  const filtered = baseList.filter((c) => c <= maxByTheme);
  return filtered.length > 0 ? filtered : [baseList[0]];
}

export function getBombOptions(set: SetType): number[] {
  return set === 'pairs' ? [0, 2, 4, 6] : [0, 3, 6, 9];
}

export interface PlayerColorOption {
  name: string;
  hex: string;
}

export const PLAYER_COLORS: PlayerColorOption[] = [
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'lime', hex: '#65a30d' },
  { name: 'amber', hex: '#d97706' },
  { name: 'violet', hex: '#7c3aed' },
  { name: 'pink', hex: '#db2777' },
  { name: 'teal', hex: '#0d9488' },
  { name: 'red', hex: '#dc2626' },
  { name: 'indigo', hex: '#4f46e5' },
];

export interface CampaignLevelSpec {
  level: number;
  cards: number;
  set: SetType;
  theme: string;
  bombs: number;
}

export const CAMPAIGN_LEVELS: CampaignLevelSpec[] = [
  { level: 1, cards: 8, set: 'pairs', theme: 'sushi', bombs: 0 },
  { level: 2, cards: 12, set: 'pairs', theme: 'animals', bombs: 0 },
  { level: 3, cards: 16, set: 'pairs', theme: 'ocean', bombs: 0 },
  { level: 4, cards: 12, set: 'triplets', theme: 'flowers', bombs: 0 },
  { level: 5, cards: 20, set: 'pairs', theme: 'food', bombs: 0 },
  { level: 6, cards: 15, set: 'triplets', theme: 'monsters', bombs: 0 },
  { level: 7, cards: 24, set: 'pairs', theme: 'desert', bombs: 0 },
  { level: 8, cards: 18, set: 'triplets', theme: 'birds', bombs: 0 },
  { level: 9, cards: 30, set: 'pairs', theme: 'eighties', bombs: 0 },
  { level: 10, cards: 21, set: 'triplets', theme: 'pets', bombs: 0 },
  { level: 11, cards: 36, set: 'pairs', theme: 'space', bombs: 0 },
  { level: 12, cards: 27, set: 'triplets', theme: 'fairy_tales', bombs: 0 },
  { level: 13, cards: 42, set: 'pairs', theme: 'insects', bombs: 0 },
  { level: 14, cards: 30, set: 'triplets', theme: 'music', bombs: 0 },
  { level: 15, cards: 50, set: 'pairs', theme: 'halloween', bombs: 0 },
  { level: 16, cards: 36, set: 'triplets', theme: 'spring', bombs: 0 },
  { level: 17, cards: 60, set: 'pairs', theme: 'flags', bombs: 0 },
  { level: 18, cards: 42, set: 'triplets', theme: 'cats', bombs: 0 },
  { level: 19, cards: 72, set: 'pairs', theme: 'food', bombs: 0 },
  { level: 20, cards: 54, set: 'triplets', theme: 'monsters', bombs: 0 },
  { level: 21, cards: 84, set: 'pairs', theme: 'animals', bombs: 0 },
  { level: 22, cards: 63, set: 'triplets', theme: 'ocean', bombs: 0 },
  { level: 23, cards: 100, set: 'pairs', theme: 'food', bombs: 0 },
];

export interface GridLayout {
  columns: number;
  rows: number;
  gaps: number;
}

export function computeLayouts(cardCount: number): GridLayout[] {
  const layouts: GridLayout[] = [];
  for (let cols = 1; cols <= cardCount; cols++) {
    for (let rows = 1; rows <= cardCount; rows++) {
      const total = cols * rows;
      const gaps = total - cardCount;
      const validZeroGap = gaps === 0;
      const validOneGap = gaps === 1 && total % 2 === 1 && cardCount % 2 === 0;
      if (validZeroGap || validOneGap) {
        const ratio = Math.max(cols, rows) / Math.min(cols, rows);
        if (ratio <= 3.5 || cardCount <= 12) {
          layouts.push({ columns: cols, rows, gaps });
        }
      }
    }
  }
  if (layouts.length === 0) {
    const cols = Math.ceil(Math.sqrt(cardCount));
    const rows = Math.ceil(cardCount / cols);
    layouts.push({ columns: cols, rows, gaps: 0 });
  }
  return layouts;
}

export function computeCardGap(space: [number, number], layout: GridLayout): number {
  const [width, height] = space;
  const raw = Math.round(Math.min(width / layout.columns, height / layout.rows) * 0.06);
  return Math.max(2, Math.min(8, raw));
}

export function computeCardSize(space: [number, number], layout: GridLayout): number {
  const [width, height] = space;
  const gap = computeCardGap(space, layout);
  return Math.min(
    (width - gap * (layout.columns - 1)) / layout.columns,
    (height - gap * (layout.rows - 1)) / layout.rows
  );
}

export function computeReservedHeight(
  viewportWidth: number,
  playersNeeded: number,
  playersCount: number,
  isSpectator = false
): number {
  if (viewportWidth >= 1024) {
    return 64;
  }
  const row = (cond: boolean, h: number) => (cond ? h + 8 : 0);
  return (
    16 +
    row(true, 40) +
    row(playersNeeded > 1, 40) +
    row(playersCount > 1, 30) +
    row(isSpectator, 44)
  );
}

export function computeFieldSpace(
  viewport: [number, number],
  playersNeeded: number,
  playersCount: number,
  isSpectator = false
): [number, number] {
  const [w, h] = viewport;
  const reserved = computeReservedHeight(w, playersNeeded, playersCount, isSpectator);
  return [w >= 1024 ? w - 416 : w - 16, Math.max(200, h - reserved)];
}

export function selectBestLayout(
  viewport: [number, number],
  layouts: GridLayout[],
  cardCount: number,
  playersNeeded: number,
  playersCount: number,
  isSpectator = false
): GridLayout {
  const space = computeFieldSpace(viewport, playersNeeded, playersCount, isSpectator);
  if (layouts.length === 0) {
    return { columns: cardCount, rows: 1, gaps: 0 };
  }
  const sorted = [...layouts].sort((a, b) => {
    const sizeDiff = computeCardSize(space, b) - computeCardSize(space, a);
    if (Math.abs(sizeDiff) > 0.01) return sizeDiff;
    return a.gaps - b.gaps;
  });
  return sorted[0];
}

export function computeFieldWidthCss(
  viewport: [number, number],
  layout: GridLayout,
  gap: number,
  playersNeeded: number,
  playersCount: number,
  isSpectator = false
): string {
  const [w] = viewport;
  const reserved = computeReservedHeight(w, playersNeeded, playersCount, isSpectator);
  const padding = w >= 1024 ? ' + 1rem' : '';
  const vGapPx = `${reserved + gap * (layout.rows - 1)}px`;
  const ratio = layout.columns / layout.rows;
  const hGapPx = `${gap * (layout.columns - 1)}px`;
  return `min(100%, calc((100dvh - ${vGapPx}) * ${ratio} + ${hGapPx}${padding}))`;
}

export type CardState = 'down' | 'up' | 'cleared' | 'revealed';

export interface MemoryCard {
  index: number;
  state: CardState;
  image: number | null;
  bomb: boolean;
  seen: boolean;
}

export interface MemoryPlayer {
  id: string;
  name: string | null;
  color: string;
  colorName: string;
  score: number;
  accuracy: number | null;
  hits: number;
  misses: number;
  away: boolean;
  dead: boolean;
  failedDemining: boolean;
  deminer: boolean;
  isBot?: boolean;
}

export interface CampaignState {
  level: number;
  levels: number;
}

export interface MemoryGameState {
  id: string;
  theme: string;
  randomTheme: boolean;
  set: 2 | 3;
  cardsCount: number;
  cards: MemoryCard[];
  images: number[];
  layouts: GridLayout[];
  waiting: boolean;
  started: boolean;
  finished: boolean;
  failed: boolean;
  elapsedMs: number;
  startedAtMs: number | null;
  turn: string | null;
  ongoing: boolean;
  turnMs: number;
  turnStartedAtMs: number | null;
  turnLimitMs: number | null;
  players: MemoryPlayer[];
  playersNeeded: number;
  playMode: PlayMode;
  botDifficulty: BotDifficulty;
  editing: string | null;
  campaign: CampaignState | null;
  bombs: number;
  bombsSeen: number;
  offer: boolean;
  demining: boolean;
  deminingEnabled: boolean;
  visibility: 'public' | 'private';
  watchers: number;
  turnFlipIndices: number[];
  turnStartSeenIndices: number[];
}

export interface CreateGameOptions {
  id?: string;
  theme: string;
  set: SetType;
  cardsCount: number;
  playersCount: number;
  playMode?: PlayMode;
  botDifficulty?: BotDifficulty;
  playerNames?: string[];
  playerColors?: PlayerColorOption[];
  bombs?: number;
  deminingEnabled?: boolean;
  turnLimitMs?: number | null;
  visibility?: 'public' | 'private';
  campaignLevel?: number | null;
  seed?: number;
}

function seededRandom(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateShortId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function createGame(opts: CreateGameOptions): MemoryGameState {
  const rng = seededRandom(opts.seed);
  const id = opts.id || generateShortId();
  const isCampaign = typeof opts.campaignLevel === 'number' && opts.campaignLevel >= 1;
  const campaignSpec = isCampaign
    ? CAMPAIGN_LEVELS.find((l) => l.level === opts.campaignLevel) || CAMPAIGN_LEVELS[0]
    : null;

  const requestedTheme = campaignSpec ? campaignSpec.theme : opts.theme;
  const randomTheme = requestedTheme === 'random';
  const concreteTheme = randomTheme
    ? CONCRETE_THEMES[Math.floor(rng() * CONCRETE_THEMES.length)].id
    : requestedTheme;
  const themeMeta = THEMES.find((t) => t.id === concreteTheme) || CONCRETE_THEMES[0];

  const setNum: 2 | 3 = (campaignSpec ? campaignSpec.set : opts.set) === 'triplets' ? 3 : 2;
  const cardsCount = campaignSpec ? campaignSpec.cards : opts.cardsCount;
  const bombs = campaignSpec ? campaignSpec.bombs : (opts.bombs ?? 0);
  const safeBombs = bombs < cardsCount ? bombs : 0;

  const pictureCardsCount = cardsCount - safeBombs;
  const groupCount = Math.floor(pictureCardsCount / setNum);

  const allImageNumbers = Array.from({ length: themeMeta.imageCount }, (_, i) => i + 1);
  const selectedImages = shuffleArray(allImageNumbers, rng)
    .slice(0, groupCount)
    .sort((a, b) => a - b);

  const rawDeck: Array<{ image: number | null; bomb: boolean }> = [];
  for (const img of selectedImages) {
    for (let k = 0; k < setNum; k++) {
      rawDeck.push({ image: img, bomb: false });
    }
  }
  for (let b = 0; b < safeBombs; b++) {
    rawDeck.push({ image: null, bomb: true });
  }
  // Pad if needed
  while (rawDeck.length < cardsCount) {
    rawDeck.push({ image: 1, bomb: false });
  }

  const shuffledDeck = shuffleArray(rawDeck, rng);
  const cards: MemoryCard[] = shuffledDeck.map((item, index) => ({
    index,
    state: 'down',
    image: item.image,
    bomb: item.bomb,
    seen: false,
  }));

  const playersNeeded = isCampaign ? 1 : Math.max(1, Math.min(4, opts.playersCount || 1));
  const playMode: PlayMode = isCampaign ? 'local' : (opts.playMode || 'local');
  const botDifficulty: BotDifficulty = opts.botDifficulty || 'normal';

  const defaultBotNames = ['Octo Bot', 'Mocto Bot', 'Inky Bot'];
  const players: MemoryPlayer[] = [];

  const initialPlayerCount = playMode === 'online' && playersNeeded > 1 ? 1 : playersNeeded;

  for (let i = 0; i < initialPlayerCount; i++) {
    const colorOpt = opts.playerColors?.[i] || PLAYER_COLORS[i % PLAYER_COLORS.length];
    const isBot = playMode === 'bot' && i > 0;
    const customName = opts.playerNames?.[i]?.trim();
    const fallbackName = isBot
      ? defaultBotNames[(i - 1) % defaultBotNames.length]
      : playersNeeded > 1
        ? `Player ${i + 1}`
        : (customName || 'Player 1');

    players.push({
      id: `p${i + 1}`,
      name: customName || fallbackName,
      color: colorOpt.hex,
      colorName: colorOpt.name,
      score: 0,
      accuracy: null,
      hits: 0,
      misses: 0,
      away: false,
      dead: false,
      failedDemining: false,
      deminer: false,
      isBot,
    });
  }

  const waiting = playMode === 'online' && players.length < playersNeeded;
  const deminingEnabled = opts.deminingEnabled !== undefined ? opts.deminingEnabled : safeBombs > 0;
  const turnLimitMs =
    opts.turnLimitMs !== undefined
      ? opts.turnLimitMs
      : playMode === 'online' && playersNeeded > 1
        ? 15000
        : null;

  return {
    id,
    theme: concreteTheme,
    randomTheme,
    set: setNum,
    cardsCount,
    cards,
    images: selectedImages,
    layouts: computeLayouts(cardsCount),
    waiting,
    started: false,
    finished: false,
    failed: false,
    elapsedMs: 0,
    startedAtMs: null,
    turn: players[0]?.id || 'p1',
    ongoing: false,
    turnMs: 0,
    turnStartedAtMs: null,
    turnLimitMs,
    players,
    playersNeeded,
    playMode,
    botDifficulty,
    editing: null,
    campaign: campaignSpec
      ? { level: campaignSpec.level, levels: CAMPAIGN_LEVELS.length }
      : null,
    bombs: safeBombs,
    bombsSeen: 0,
    offer: false,
    demining: false,
    deminingEnabled,
    visibility: opts.visibility || 'public',
    watchers: 0,
    turnFlipIndices: [],
    turnStartSeenIndices: [],
  };
}

export function canFlipCard(game: MemoryGameState, cardIndex: number, actorPlayerId?: string): boolean {
  if (game.waiting || game.finished) return false;
  if (actorPlayerId && game.turn !== actorPlayerId) return false;
  const card = game.cards[cardIndex];
  if (!card) return false;
  return card.state === 'down' || (card.state === 'up' && !game.ongoing);
}

export interface FlipOutcome {
  state: MemoryGameState;
  sounds: MemorySoundName[];
}

function getNextLivingPlayerId(players: MemoryPlayer[], currentId: string | null): string | null {
  const living = players.filter((p) => !p.dead);
  if (living.length === 0) return null;
  const idx = players.findIndex((p) => p.id === currentId);
  for (let step = 1; step <= players.length; step++) {
    const candidate = players[(idx + step) % players.length];
    if (!candidate.dead) return candidate.id;
  }
  return living[0].id;
}

export function flipCard(
  prevGame: MemoryGameState,
  cardIndex: number,
  nowMs = Date.now()
): FlipOutcome {
  if (!canFlipCard(prevGame, cardIndex)) {
    return { state: prevGame, sounds: [] };
  }

  const game: MemoryGameState = {
    ...prevGame,
    cards: prevGame.cards.map((c) => ({ ...c })),
    players: prevGame.players.map((p) => ({ ...p })),
    turnFlipIndices: [...prevGame.turnFlipIndices],
    turnStartSeenIndices: [...prevGame.turnStartSeenIndices],
  };

  const sounds: MemorySoundName[] = ["flip"];

  if (!game.started) {
    game.started = true;
    game.startedAtMs = nowMs;
    game.turnStartedAtMs = nowMs;
  } else if (game.startedAtMs !== null) {
    game.elapsedMs = Math.max(0, nowMs - game.startedAtMs);
  }

  const currentPlayer = game.players.find((p) => p.id === game.turn) || game.players[0];
  const targetCard = game.cards[cardIndex];
  const prevBombsSeen = game.bombsSeen;

  // 1. Handle active Demining Offer (the last unseen bomb is currently up and player chooses next card)
  if (game.offer) {
    game.offer = false;
    if (targetCard.bomb) {
      // Player chose to demine! Keep existing up bomb(s) up and turn this bomb up too
      for (const c of game.cards) {
        if (c.state === "up" && !c.bomb) c.state = "down";
      }
      targetCard.state = "up";
      targetCard.seen = true;
      const upBombs = game.cards.filter((c) => c.bomb && c.state === "up");
      if (upBombs.length >= game.bombs) {
        for (const b of upBombs) b.state = "cleared";
        currentPlayer.deminer = true;
        currentPlayer.score += game.bombs;
        game.demining = false;
        game.ongoing = false;
        sounds.push("match");
        return finalizeGameCheck(game, sounds, nowMs);
      } else {
        game.demining = true;
        game.ongoing = true;
        return { state: game, sounds };
      }
    } else {
      // Player declined demining and flipped a normal card to play on
      for (const c of game.cards) {
        if (c.state === "up" && c.index !== cardIndex) c.state = "down";
      }
      game.ongoing = false;
      // Fall through to start a normal turn with targetCard
    }
  }

  // 2. Handle active Demining mode (player must turn all remaining bombs)
  if (game.demining) {
    targetCard.state = "up";
    targetCard.seen = true;
    if (!targetCard.bomb) {
      currentPlayer.failedDemining = true;
      game.demining = false;
      return triggerBombExplosion(game, currentPlayer, sounds, nowMs);
    }
    const upBombs = game.cards.filter((c) => c.bomb && c.state === "up");
    if (upBombs.length >= game.bombs) {
      for (const b of upBombs) b.state = "cleared";
      currentPlayer.deminer = true;
      currentPlayer.score += game.bombs;
      game.demining = false;
      game.ongoing = false;
      sounds.push("match");
      return finalizeGameCheck(game, sounds, nowMs);
    }
    return { state: game, sounds };
  }

  // 3. Starting a new turn (ongoing === false)
  if (!game.ongoing) {
    game.turnStartSeenIndices = game.cards.filter((c) => c.seen).map((c) => c.index);
    game.turnFlipIndices = [cardIndex];
    game.turnStartedAtMs = nowMs;
    game.turnMs = 0;

    for (const c of game.cards) {
      if (c.state === "up" && c.index !== cardIndex) {
        c.state = "down";
      }
    }
    targetCard.state = "up";

    const wasSeenBeforeTurn = game.turnStartSeenIndices.includes(cardIndex);
    if (targetCard.bomb && wasSeenBeforeTurn) {
      targetCard.seen = true;
      return triggerBombExplosion(game, currentPlayer, sounds, nowMs);
    }

    targetCard.seen = true;
    game.bombsSeen = game.cards.filter((c) => c.bomb && c.seen).length;

    // Did this 1st flip reveal the last unseen bomb?
    const remainingPictures = game.cards.filter((c) => !c.bomb && c.state !== "cleared").length;
    if (
      game.deminingEnabled &&
      game.bombs > 0 &&
      prevBombsSeen < game.bombs &&
      game.bombsSeen === game.bombs &&
      remainingPictures > 0
    ) {
      game.offer = true;
      game.ongoing = true;
      return { state: game, sounds };
    }

    game.ongoing = true;
    return { state: game, sounds };
  }

  // 4. Ongoing turn (2nd card for pairs, 2nd or 3rd card for triplets)
  targetCard.state = "up";
  game.turnFlipIndices.push(cardIndex);

  const wasSeenBeforeTurn = game.turnStartSeenIndices.includes(cardIndex);
  if (targetCard.bomb && wasSeenBeforeTurn) {
    targetCard.seen = true;
    return triggerBombExplosion(game, currentPlayer, sounds, nowMs);
  }

  targetCard.seen = true;
  game.bombsSeen = game.cards.filter((c) => c.bomb && c.seen).length;

  // Did this flip reveal the last unseen bomb?
  const remainingPictures = game.cards.filter((c) => !c.bomb && c.state !== "cleared").length;
  if (
    game.deminingEnabled &&
    game.bombs > 0 &&
    prevBombsSeen < game.bombs &&
    game.bombsSeen === game.bombs &&
    remainingPictures > 0
  ) {
    game.offer = true;
    game.ongoing = false;
    return { state: game, sounds };
  }

  const upCards = game.cards.filter((c) => c.state === "up");
  if (upCards.length < game.set) {
    return { state: game, sounds };
  }

  // Evaluate completed turn (2 cards for pairs, 3 cards for triplets)
  game.ongoing = false;
  const firstImg = upCards[0].image;
  const isMatch =
    firstImg !== null &&
    !upCards.some((c) => c.bomb) &&
    upCards.every((c) => c.image === firstImg);

  if (isMatch) {
    for (const c of upCards) {
      c.state = "cleared";
    }
    currentPlayer.score += game.set;
    currentPlayer.hits += 1;
    currentPlayer.accuracy = Math.round(
      (currentPlayer.hits / (currentPlayer.hits + currentPlayer.misses)) * 100
    );
    sounds.push("match");
    return finalizeGameCheck(game, sounds, nowMs);
  }

  // Mismatch
  const firstCardIdx = game.turnFlipIndices[0];
  const firstCard = game.cards[firstCardIdx];
  let wasAvoidableMistake = false;

  if (!firstCard.bomb && firstCard.image !== null) {
    const matchingPartners = game.cards.filter(
      (c) => c.index !== firstCardIdx && c.image === firstCard.image
    );
    const allPartnersKnownBeforeTurn = matchingPartners.every((p) =>
      game.turnStartSeenIndices.includes(p.index)
    );
    const subsequentWasSeenBeforeTurn = game.turnFlipIndices
      .slice(1)
      .some((idx) => game.turnStartSeenIndices.includes(idx));
    if (allPartnersKnownBeforeTurn || subsequentWasSeenBeforeTurn) {
      wasAvoidableMistake = true;
    }
  } else if (firstCard.bomb && game.turnStartSeenIndices.includes(firstCardIdx)) {
    wasAvoidableMistake = true;
  }

  if (wasAvoidableMistake) {
    currentPlayer.misses += 1;
    currentPlayer.accuracy = Math.round(
      (currentPlayer.hits / (currentPlayer.hits + currentPlayer.misses)) * 100
    );
    if (game.campaign !== null) {
      game.failed = true;
      game.finished = true;
      sounds.push("lose");
      return { state: game, sounds };
    }
  }

  // Advance turn to the next living player
  const prevTurn = game.turn;
  const nextTurn = getNextLivingPlayerId(game.players, prevTurn);
  game.turn = nextTurn;
  game.turnStartedAtMs = nowMs;
  game.turnMs = 0;

  if (game.players.length > 1 && nextTurn !== prevTurn) {
    sounds.push("turn");
  }

  return finalizeGameCheck(game, sounds, nowMs);
}
function triggerBombExplosion(
  game: MemoryGameState,
  victim: MemoryPlayer,
  sounds: MemorySoundName[],
  nowMs: number
): FlipOutcome {
  victim.dead = true;
  victim.misses += 1;
  victim.accuracy = Math.round((victim.hits / (victim.hits + victim.misses)) * 100);
  game.ongoing = false;
  sounds.push('boom');

  const living = game.players.filter((p) => !p.dead);
  if (game.players.length === 1 || living.length === 0) {
    game.failed = true;
    game.finished = true;
    if (game.startedAtMs !== null) {
      game.elapsedMs = Math.max(0, nowMs - game.startedAtMs);
    }
    for (const c of game.cards) {
      if (c.bomb && c.state === 'down') {
        c.state = 'revealed';
      }
    }
    sounds.push('lose');
    return { state: game, sounds };
  }

  game.turn = getNextLivingPlayerId(game.players, victim.id);
  game.turnStartedAtMs = nowMs;
  game.turnMs = 0;
  sounds.push('turn');
  return { state: game, sounds };
}

function finalizeGameCheck(
  game: MemoryGameState,
  sounds: MemorySoundName[],
  nowMs: number
): FlipOutcome {
  const remainingPictures = game.cards.filter((c) => !c.bomb && c.state !== 'cleared').length;
  if (remainingPictures === 0) {
    game.finished = true;
    game.ongoing = false;
    game.offer = false;
    game.demining = false;
    if (game.startedAtMs !== null) {
      game.elapsedMs = Math.max(1, nowMs - game.startedAtMs);
    }
    for (const c of game.cards) {
      if (c.bomb && c.state !== 'cleared') {
        c.state = 'revealed';
      }
    }
    // Replace 'match' with 'win' on the final card clear
    const matchIdx = sounds.indexOf('match');
    if (matchIdx !== -1) sounds.splice(matchIdx, 1);
    sounds.push('win');
  }
  return { state: game, sounds };
}

export function getWinners(players: MemoryPlayer[]): MemoryPlayer[] {
  if (players.length === 0) return [];
  const best = Math.max(...players.map((p) => p.score));
  return players.filter((p) => p.score === best);
}

// Smart AI Bot decision helper
export function chooseBotCardIndex(game: MemoryGameState): number | null {
  if (game.waiting || game.finished) return null;
  const available = game.cards.filter((c) => canFlipCard(game, c.index));
  if (available.length === 0) return null;

  const rememberRate =
    game.botDifficulty === 'smart' ? 0.95 : game.botDifficulty === 'normal' ? 0.65 : 0.25;

  // Avoid known bombs!
  const safeAvailable = available.filter((c) => !(c.bomb && c.seen));
  const pool = safeAvailable.length > 0 ? safeAvailable : available;

  if (!game.ongoing) {
    // Check if there is a known full pair/triplet of seen picture cards
    if (Math.random() < rememberRate) {
      const seenByImage = new Map<number, MemoryCard[]>();
      for (const c of pool) {
        if (c.seen && !c.bomb && c.image !== null) {
          const list = seenByImage.get(c.image) || [];
          list.push(c);
          seenByImage.set(c.image, list);
          if (list.length >= game.set) {
            return list[0].index;
          }
        }
      }
    }
    // Otherwise pick an unseen card if possible
    const unseen = pool.filter((c) => !c.seen);
    const targetPool = unseen.length > 0 ? unseen : pool;
    return targetPool[Math.floor(Math.random() * targetPool.length)].index;
  } else {
    // Ongoing turn: look at currently 'up' cards
    const upCards = game.cards.filter((c) => c.state === 'up');
    const firstUp = upCards[0];
    if (firstUp && !firstUp.bomb && firstUp.image !== null && Math.random() < rememberRate) {
      const knownMatch = pool.find(
        (c) => c.state !== 'up' && c.seen && c.image === firstUp.image
      );
      if (knownMatch) return knownMatch.index;
    }
    const downPool = pool.filter((c) => c.state === 'down');
    const unseenDown = downPool.filter((c) => !c.seen);
    const pickFrom = unseenDown.length > 0 ? unseenDown : downPool.length > 0 ? downPool : pool;
    return pickFrom[Math.floor(Math.random() * pickFrom.length)].index;
  }
}

export function formatClockTime(ms: number): string {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function formatLeaderboardTime(ms: number): string {
  const clamped = Math.max(100, ms);
  const totalTenths = Math.round(clamped / 100);
  const mins = Math.floor(totalTenths / 600);
  const secs = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${mins}:${String(secs).padStart(2, '0')}.${tenths}`;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  accuracy: number;
  timeMs: number;
  theme: string;
  set: SetType;
  cards: number;
  bombs: number;
  date: string;
}

export const DEFAULT_BEST_RESULTS: LeaderboardEntry[] = [
  { id: 'b1', name: 'Swirly Sponge', accuracy: 100, timeMs: 11700, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b2', name: 'Bogdan', accuracy: 89, timeMs: 16200, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b3', name: 'Benthe', accuracy: 50, timeMs: 20800, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b4', name: 'Max', accuracy: 80, timeMs: 21100, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b5', name: 'Ari-2000', accuracy: 100, timeMs: 21900, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b6', name: 'Жук усатый', accuracy: 73, timeMs: 23100, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b7', name: 'Zippy Squid', accuracy: 86, timeMs: 24700, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b8', name: 'Snappy Plankton', accuracy: 58, timeMs: 27800, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b9', name: 'Qwerbalken', accuracy: 86, timeMs: 31700, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
  { id: 'b10', name: 'Breezy Oyster', accuracy: 67, timeMs: 34100, theme: 'random', set: 'pairs', cards: 16, bombs: 0, date: '2026-10-28' },
];

export const DEFAULT_CAMPAIGN_LEADERS = [
  { name: 'Жук усатый', level: 10 },
  { name: 'Qwerbalken', level: 10 },
  { name: 'Polite Pufferfish', level: 3 },
  { name: 'Max', level: 3 },
  { name: 'Mighty Starfish', level: 2 },
  { name: 'Radhika', level: 1 },
];
