import { describe, it, expect } from 'vitest';
import {
  THEMES,
  CAMPAIGN_LEVELS,
  getAvailableCardCounts,
  getBombOptions,
  computeLayouts,
  selectBestLayout,
  createGame,
  flipCard,
  getWinners,
  chooseBotCardIndex,
  formatClockTime,
  formatLeaderboardTime,
} from './gameEngine';

describe('Octomocto Memory Game Engine', () => {
  it('includes all 18 official themes + random + ai_studio', () => {
    expect(THEMES.length).toBe(20);
    expect(THEMES[0].id).toBe('random');
    expect(THEMES.find((t) => t.id === 'sushi')?.imageCount).toBe(50);
    expect(THEMES.find((t) => t.id === 'food')?.imageCount).toBe(100);
    expect(THEMES.find((t) => t.id === 'spring')?.imageCount).toBe(38);
    expect(THEMES.find((t) => t.id === 'eighties')?.imageCount).toBe(40);
    expect(THEMES.find((t) => t.id === 'ai_studio')?.isAI).toBe(true);
  });

  it('clamps available card counts based on theme image count and set type', () => {
    const sushiPairs = getAvailableCardCounts('sushi', 'pairs');
    expect(sushiPairs[0]).toBe(16);
    expect(sushiPairs[sushiPairs.length - 1]).toBe(100);
    expect(sushiPairs.length).toBe(33);

    const springPairs = getAvailableCardCounts('spring', 'pairs');
    expect(springPairs[springPairs.length - 1]).toBe(76); // 38 * 2

    const eightiesPairs = getAvailableCardCounts('eighties', 'pairs');
    expect(eightiesPairs[eightiesPairs.length - 1]).toBe(80); // 40 * 2

    const triplets = getAvailableCardCounts('sushi', 'triplets');
    expect(triplets[0]).toBe(15);
    expect(triplets[triplets.length - 1]).toBe(99);
    expect(triplets.length).toBe(22);
  });

  it('returns correct bomb options for pairs and triplets', () => {
    expect(getBombOptions('pairs')).toEqual([0, 2, 4, 6]);
    expect(getBombOptions('triplets')).toEqual([0, 3, 6, 9]);
  });

  it('computes layouts including 1-gap odd grids like 5x5 for 24 cards', () => {
    const layouts16 = computeLayouts(16);
    expect(layouts16).toContainEqual({ columns: 4, rows: 4, gaps: 0 });

    const layouts24 = computeLayouts(24);
    expect(layouts24).toContainEqual({ columns: 6, rows: 4, gaps: 0 });
    expect(layouts24).toContainEqual({ columns: 5, rows: 5, gaps: 1 });

    const best = selectBestLayout([1280, 800], layouts16, 16, 1, 1);
    expect(best).toEqual({ columns: 4, rows: 4, gaps: 0 });
  });

  it('supports 2-player (and 2-4 player) Pass & Play on a single device with extra turn on match', () => {
    let game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 16,
      playersCount: 2,
      playMode: 'local',
      playerNames: ['Player 1', 'Player 2'],
      seed: 42,
    });

    expect(game.waiting).toBe(false);
    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe('Player 1');
    expect(game.players[1].name).toBe('Player 2');
    expect(game.turn).toBe('p1');

    // Find two cards that do NOT match for Player 1's first turn
    const c0 = game.cards[0];
    const mismatchCard = game.cards.find((c) => c.index !== 0 && c.image !== c0.image)!;

    let res = flipCard(game, 0, 1000);
    game = res.state;
    expect(game.ongoing).toBe(true);
    expect(game.turn).toBe('p1');

    res = flipCard(game, mismatchCard.index, 1500);
    game = res.state;
    expect(game.ongoing).toBe(false);
    // Turn must advance to Player 2 on mismatch!
    expect(game.turn).toBe('p2');
    expect(res.sounds).toContain('turn');

    // Now Player 2 matches a pair and must get +2 points AND keep their turn!
    const targetImage = game.cards[0].image!;
    const pairIndices = game.cards
      .filter((c) => c.image === targetImage)
      .map((c) => c.index);

    res = flipCard(game, pairIndices[0], 2000);
    game = res.state;
    expect(game.ongoing).toBe(true);
    expect(game.turn).toBe('p2');

    res = flipCard(game, pairIndices[1], 2500);
    game = res.state;
    expect(game.ongoing).toBe(false);
    expect(game.players[1].score).toBe(2);
    expect(game.players[1].accuracy).toBe(100);
    // Player 2 goes again!
    expect(game.turn).toBe('p2');
    expect(res.sounds).toContain('match');
  });

  it('handles Triplets matching (3 cards per set, +3 points)', () => {
    let game = createGame({
      theme: 'animals',
      set: 'triplets',
      cardsCount: 15,
      playersCount: 1,
      seed: 7,
    });

    const targetImg = game.cards[0].image!;
    const tripletIndices = game.cards
      .filter((c) => c.image === targetImg)
      .map((c) => c.index);
    expect(tripletIndices.length).toBe(3);

    game = flipCard(game, tripletIndices[0], 100).state;
    expect(game.ongoing).toBe(true);
    game = flipCard(game, tripletIndices[1], 200).state;
    expect(game.ongoing).toBe(true);
    const out = flipCard(game, tripletIndices[2], 300);
    game = out.state;
    expect(game.ongoing).toBe(false);
    expect(game.players[0].score).toBe(3);
    expect(out.sounds).toContain('match');
  });

  it('handles Bombs: unseen bomb is safe, seen bomb explodes, and demining clears all bombs', () => {
    let game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 16,
      playersCount: 1,
      bombs: 4,
      deminingEnabled: true,
      seed: 99,
    });

    const bombIndices = game.cards.filter((c) => c.bomb).map((c) => c.index);
    const safeIndices = game.cards.filter((c) => !c.bomb).map((c) => c.index);
    expect(bombIndices.length).toBe(4);

    // Flip first 3 unseen bombs with safe cards
    game = flipCard(game, bombIndices[0], 100).state;
    game = flipCard(game, safeIndices[0], 150).state;
    expect(game.bombsSeen).toBe(1);

    game = flipCard(game, bombIndices[1], 200).state;
    game = flipCard(game, safeIndices[1], 250).state;
    expect(game.bombsSeen).toBe(2);

    game = flipCard(game, bombIndices[2], 300).state;
    game = flipCard(game, safeIndices[2], 350).state;
    expect(game.bombsSeen).toBe(3);

    // Flip 4th (last) unseen bomb -> offer becomes true immediately!
    game = flipCard(game, bombIndices[3], 400).state;
    expect(game.bombsSeen).toBe(4);
    expect(game.offer).toBe(true);

    // Flip another bomb (bombIndices[0]) to enter demining mode (2/4 up)
    game = flipCard(game, bombIndices[0], 500).state;
    expect(game.offer).toBe(false);
    expect(game.demining).toBe(true);

    // Flip 3rd bomb (bombIndices[1]) -> still demining (3/4 up)
    game = flipCard(game, bombIndices[1], 550).state;
    expect(game.demining).toBe(true);

    // Flip 4th bomb (bombIndices[2]) -> all 4 bombs cleared, deminer badge awarded!
    const demineOut = flipCard(game, bombIndices[2], 600);
    game = demineOut.state;
    expect(game.demining).toBe(false);
    expect(game.players[0].deminer).toBe(true);
    expect(game.players[0].score).toBe(4);
    for (const bIdx of bombIndices) {
      expect(game.cards[bIdx].state).toBe('cleared');
    }
  });

  it('explodes when a player flips a bomb that was already seen', () => {
    let game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 16,
      playersCount: 1,
      bombs: 2,
      deminingEnabled: false,
      seed: 101,
    });

    const bombIdx = game.cards.findIndex((c) => c.bomb);
    const safeIdx = game.cards.findIndex((c) => !c.bomb);

    // Turn 1: flip unseen bomb + safe card
    game = flipCard(game, bombIdx, 100).state;
    game = flipCard(game, safeIdx, 200).state;
    expect(game.failed).toBe(false);

    // Turn 2: flip the SAME bomb again -> BOOM!
    const out = flipCard(game, bombIdx, 300);
    expect(out.state.failed).toBe(true);
    expect(out.state.finished).toBe(true);
    expect(out.sounds).toContain('boom');
  });

  it('enforces 100% accuracy in Campaign mode', () => {
    expect(CAMPAIGN_LEVELS.length).toBe(23);
    let game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 8,
      playersCount: 1,
      campaignLevel: 1,
      seed: 12,
    });
    expect(game.campaign).toEqual({ level: 1, levels: 23 });
    expect(game.cards.length).toBe(8);

    // Turn 1: flip two non-matching cards (0 and mismatch)
    const c0 = game.cards[0];
    const mismatchIdx = game.cards.findIndex((c, i) => i > 0 && c.image !== c0.image);
    game = flipCard(game, 0, 100).state;
    game = flipCard(game, mismatchIdx, 200).state;
    expect(game.failed).toBe(false); // Unseen exploration is allowed!

    // Turn 2: intentionally flip card 0 and mismatchIdx AGAIN (now both were already seen!)
    game = flipCard(game, 0, 300).state;
    const failOut = flipCard(game, mismatchIdx, 400);
    expect(failOut.state.failed).toBe(true);
    expect(failOut.state.finished).toBe(true);
  });

  it('formats clock and leaderboard times accurately', () => {
    expect(formatClockTime(0)).toBe('0:00');
    expect(formatClockTime(11700)).toBe('0:11');
    expect(formatClockTime(75000)).toBe('1:15');
    expect(formatLeaderboardTime(11700)).toBe('0:11.7');
    expect(formatLeaderboardTime(65200)).toBe('1:05.2');
  });

  it('chooses valid bot moves', () => {
    const game = createGame({
      theme: 'sushi',
      set: 'pairs',
      cardsCount: 16,
      playersCount: 2,
      playMode: 'bot',
    });
    const idx = chooseBotCardIndex(game);
    expect(idx).not.toBeNull();
    expect(idx!).toBeGreaterThanOrEqual(0);
    expect(idx!).toBeLessThan(16);
  });
});
