# The Variable Game — Ranked Edition

A browser puzzle where you write Python-like variable assignments to satisfy
a growing list of rules at the same time — think neal.fun's password game,
but for code.

```
x = 5
name = "orbit"
list = [3, 7, 12]
```

Each task hands you a fresh set of rules pulled from a hidden reference
solution - "your numbers must sum to 42," "one variable name must have no
vowels," "a list must be sorted" - and every rule is guaranteed solvable
alongside the others, since they're all derived from one consistent answer
under the hood. You've got 45 seconds to satisfy all of them before the
timer runs out and the editor starts deleting your code from the bottom,
one line at a time, until you hit sync.

Three difficulty tiers (1 / 3 / 5 rules at once), infinite non-repeating
tasks, singleplayer or live multiplayer room races against friends, a
leaderboard with win streaks and daily streaks, and a first-visit spotlight
walkthrough for new players.

## Play it live

**[jamallyemin.github.io/The-Variable-Game](https://jamallyemin.github.io/The-Variable-Game/)**

Just open the link — no install, no account, no setup. It's already connected
to a live Firebase backend, so multiplayer rooms, the leaderboard, and streaks
all work out of the box.

## Project layout

```
frontend/              <- this whole folder is what you deploy to GitHub Pages
  index.html
  style.css
  script.js              app logic: screens, game loop, onboarding
  taskEngine.js           random task generator (serializable, so tasks can be
                          shared between players' browsers via Firestore)
  parser.js               turns typed code into structured variables
  firebaseClient.js        all networking — nicknames, scores, streaks,
                          rooms, live races. This is what replaces a backend.
  tutorial.js              spotlight walkthrough
  config.js                Firebase config + local player state caching

firestore.rules          security rules — this is the real security boundary.
```

**Runs entirely as static files** — no server, no build step. Multiplayer,
the leaderboard, and streaks are powered by Firebase's free tier, which is
built specifically for apps with no custom backend.
