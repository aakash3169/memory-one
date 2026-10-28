# Octomocto Memory

A complete memory-card game you can play in the browser: solo free play, a 23-level campaign, pass-and-play for up to four people on one device, and a memory-aware bot. The rules live in a pure TypeScript engine, the UI is React 18, and Vite builds the app.

## Live demo

- [Free Play](https://octomocto-memory-game.vercel.app/memory)
- [Campaign](https://octomocto-memory-game.vercel.app/memory/campaign)

`vercel.json` rewrites `/memory`, `/memory/campaign`, and `/memory/:id` to the single-page app.

## Feature matrix

| Feature | What you get |
| --- | --- |
| Free Play | Open-ended games at `/memory`. Pick the theme, set size, card count, bombs, and who is playing, then start immediately. |
| 23-level campaign | A winding snake map at `/memory/campaign` (3 columns on small screens, 4 on desktop). Levels run from 8 cards up to 100. **100% accuracy** unlocks the next level. An **unlock-all** toggle opens every level for practice and can lock progression again. |
| 1–4 player pass & play | Single-device **Pass & Play** is the default for 2, 3, or 4 players. Each player has a name and a color (sky, lime, amber, violet, pink, teal, red, indigo). A match scores and keeps the turn; a miss passes the device to the next living player. |
| Smart Bot | **vs Bot** seats 1–3 AI opponents. Easy, normal, and smart difficulties remember seen cards at different rates, chase known pairs or triplets, and avoid bombs they have already seen. |
| Online rooms | **Online / Share link** opens a room id under `/memory/:id` for multi-tab play, with a public or private lobby. |
| Pairs and triplets | **Pairs** (`set = 2`) match two copies. **Triplets** (`set = 3`) match three. A cleared set scores 2 or 3 points. |
| Grid layout engine | Card counts run from **15 to 100**. `selectBestLayout` (the best-layout picker) chooses columns, rows, and gaps that maximize card size for the current viewport. A one-cell gap, when the grid is one larger than the deck, sits at the center index. |
| Bombs and demining | Pairs can add **2, 4, or 6** bombs. Triplets can add **3, 6, or 9**. An unseen bomb is tracked and ends the turn without eliminating anyone. Turning a bomb that was already seen is a boom: solo play ends, and in a group that player is out while the others continue. When the **last unseen bomb** is found and picture cards remain, the **Demining Offer** appears. Turning the rest of the bombs face-up clears the field, awards **+1 point per bomb** (a 4-bomb field pays **+4**, a 6-bomb field pays **+6**), and grants the Deminer badge. A wrong card during demining puts that player out. |
| 20 card themes | **Random**, 18 illustrated packs, and a custom **AI Studio** pack. Together they are **983 vector card illustrations** (975 in the illustrated packs, 8 in AI Studio), served from local SVG assets with no image CDN. Counts: Sushi 50, Food 100, Desert 50, Ocean 50, Monsters 100, Insects 50, Eighties 40, Spring 38, Flowers 50, Birds 49, Pets 50, Animals 50, Fairy Tales 50, Music 50, Halloween 48, Flags 50, Cats 50, Space 50, AI Studio 8. Random picks a fresh illustrated pack each game. Cats and Space invert in dark mode. |
| Sound | A Web Audio synthesizer in `src/sound.ts` plays start, flip, match, boom, turn, win, lose, and lobby cues. Flip is a bandpass noise burst; boom is a lowpass explosion plus a falling sine. A mute toggle is remembered in `localStorage`. |
| Light, dark, and system theme | The header switches **System**, **Light**, and **Dark**. The choice is stored as `localStorage["phx:theme"]` and follows the OS when set to System. |

## Architecture and testing

The rules are isolated from React so they can be tested without a browser.

- `src/gameEngine.ts` owns themes, campaign specs, deck building, flips, bombs, demining, turn order, scoring, the bot, and `selectBestLayout`.
- `src/gameEngine.test.ts` is the Vitest suite: theme counts, card-count clamping, bomb options, layouts, pass-and-play turns, triplets, bomb tracking, the demining offer, campaign accuracy, clocks, and bot moves.
- `src/App.tsx` routes Free Play, Campaign, and rooms, and persists guest name, campaign progress, and leaderboards.
- `src/GameRoom.tsx` renders the board. `src/SettingsPanels.tsx` and `src/HeaderFooter.tsx` render the lobby, campaign map, and theme switch.
- `src/sound.ts` is the Web Audio bank. `src/svgAssets.ts` resolves the inlined illustration maps in `svgAssetsA.ts` and `svgAssetsB.ts`.
- React 18, TypeScript, and Vite. Production builds split the illustration maps into their own chunks.

```bash
npm test
```

## Local development

Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # Vite dev server
npm test         # Vitest, once
npm run build    # tsc --noEmit && vite build
npm run preview  # serve the production build
```

Open the dev server at `/memory` for Free Play or `/memory/campaign` for the campaign map.

## License

MIT. See [LICENSE](LICENSE).
