# The Variable Game

A browser puzzle where you write Python-like variable assignments to satisfy an escalating list of rules — before the timer deletes your code.

Inspired by [The Password Game](https://neal.fun/password-game/).

## How it works

You get a text editor and a list of rules. Rule 1 unlocks immediately. Satisfy it and Rule 2 appears. Keep going until all 25 are passing at once.

The catch: later rules contradict earlier ones. Rule 4 wants your numbers to sum to 50. Rule 18 wants them to sum to 75. Rule 4 doesn't just go away — it gets *superseded*, meaning it auto-passes once the stricter rule kicks in. You'll rewrite the same lines four or five times before the end.

You also have 45 seconds between saves. Let the timer hit zero and the editor starts eating your code from the bottom, one line per second. Hit **SYNC MEMORY** to reset it.

## Rules overview

25 rules covering things like:

- variable naming constraints (no vowels, unique starting letters, exact name lengths)
- arithmetic constraints on your numbers (sum, average, primality)
- string constraints (palindromes, combined length, contains "x")
- list constraints (sorted, unique, exact count)
- constraints that evolve and override earlier ones

There's exactly one valid solution. Finding it requires working backwards from the late-game rules.

## Stack

No dependencies. One HTML file, one CSS file, one JS file.

The parser handles three assignment formats:

```python
name = 42
name = "hello"
name = ["a", "b", "c"]
# also multiline lists
name = [
    "a",
    "b"
]
```

Comments and blank lines are ignored. Anything malformed is silently skipped.

## Running it

Play it at **[jamallyemin.github.io/The-Variable-Game](https://jamallyemin.github.io/The-Variable-Game/)** or download the three files and open `index.html` locally.

```
index.html
style.css
script.js
```

No build step, no server needed.

## Solution

There is one. Work it out — that's the game.

If you're stuck and want to check your logic, the constraints reduce to: 6 variables, 2 of which are numbers summing to 75 with an average of 37.5, one of them prime, 3 strings whose lengths sum to 12 with exactly one palindrome, and a sorted 3-item list. Variable names must total 30 characters, start with unique letters, and one must be exactly 8 characters long.
