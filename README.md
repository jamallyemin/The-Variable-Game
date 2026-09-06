<div align="center">
  <h1>The Variable Game — Ranked Edition</h1>
  <p>A browser puzzle where you write Python-like code to satisfy rules before the timer deletes it</p>

  <p>
    <img src="https://img.shields.io/badge/Backend-Firebase-c89b3c?style=flat-square&labelColor=111" />
    <img src="https://img.shields.io/badge/Stack-Vanilla%20JS-c89b3c?style=flat-square&labelColor=111" />
    <img src="https://img.shields.io/badge/Difficulty-3%20Tiers-c89b3c?style=flat-square&labelColor=111" />
    <img src="https://img.shields.io/badge/License-MIT-c89b3c?style=flat-square&labelColor=111" />
  </p>

  <p>
    <a href="https://jamallyemin.github.io/The-Variable-Game/">Play it live</a> ·
  </p>
</div>

---

The Variable Game is a browser puzzle where you write Python-like variable assignments to satisfy a growing list of rules at the same time — think neal.fun's password game, but for code. Every task is randomly generated and guaranteed solvable, you're racing a 45-second timer that starts deleting your code if you let it hit zero, and you can play solo, host a private room, or race friends live for a spot on the leaderboard.

## How it works

Each task builds a hidden reference solution first, then derives every rule from a real fact about it — its actual sum, its actual length, and so on. Because every rule comes from the same solution, they can never contradict each other, and there's always at least one valid answer even at the higher difficulty tiers.

You write assignments in a Python-like syntax:

```
x = 5
name = "orbit"
list = [3, 7, 12]
```

satisfying rules like "your numbers must sum to 42" or "one variable name must contain no vowels." The rules panel updates live as you type, turning green as each one passes.

You've got 45 seconds between saves. Let the timer hit zero and the editor starts eating your code from the bottom, one line per second, until you hit **SYNC MEMORY** to reset it.

## How to play

1. Pick **Singleplayer**, **Host a Room**, or **Join a Room** from the main menu.
2. Choose a difficulty — Easy (1 rule), Medium (3 rules), or Hard (5 rules).
3. Type variable assignments in the editor until every rule in the sidebar shows satisfied.
4. Sync before the 45-second timer runs out, or start losing lines from the bottom.
5. In multiplayer, whoever's valid solution reaches the server first wins the round.

## Features

- Infinite, non-repeating task generation across 3 difficulty tiers
- Live multiplayer room races — first valid solution wins
- Persistent leaderboard with win streaks and daily streaks
- A destruction-mode timer that deletes your code if you don't sync in time
- First-visit spotlight tutorial that walks through the real interface
- No login required — anonymous identity, pick a nickname and go

## Backend

The whole game runs as static files with no custom server — Firebase's free tier (Firestore + Anonymous Auth) does everything a backend normally would:

- **Identity** — every visitor gets a real, secure Firebase Auth UID with no login screen.
- **Nicknames** — reserved as their own Firestore documents, so two players can never claim the same name; enforced server-side by `firestore.rules`, not just the client.
- **Leaderboard & streaks** — scores and win/daily streaks are written per-player and aggregated client-side into the leaderboard view.
- **Live races** — room state and player lists sync in real time via Firestore listeners. The race winner is decided with a Firestore transaction, so even near-simultaneous submissions only let the genuinely first valid one through.
- **Security** — `firestore.rules` is the actual gatekeeper: it validates nickname format, blocks writing to someone else's data, and stops a room's winner from being overwritten once set.

## Frontend

Dark, high-contrast, brutalist terminal aesthetic — monospace fonts (Share Tech Mono / VT323), a CRT scanline overlay, animated grain, everything themed off CSS variables.

```
index.html          entry point, all screens
style.css            terminal look, CRT overlay, layout
script.js            screens, game loop, onboarding, timer
taskEngine.js         random task + rule generator
parser.js             turns typed code into structured variables
firebaseClient.js      nicknames, scores, streaks, rooms, live races
tutorial.js            first-visit spotlight walkthrough
config.js              Firebase config + local player state cache
firestore.rules        security rules — the real security boundary
```

No build step, no framework, no dependencies — just static files.

## License

MIT © [jamallyemin](https://github.com/jamallyemin)
