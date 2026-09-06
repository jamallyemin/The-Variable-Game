const Tutorial = (() => {
  const steps = [
    { screen: "menu", selector: "#screen-menu .menu-options", title: "PICK A MODE",
      body: "Singleplayer plays solo. Host or Join puts you in a live room with friends. All three feed the same leaderboard." },
    { screen: "menu", selector: ".identity-badge", title: "YOUR CALLSIGN",
      body: "This nickname is what shows up on the leaderboard. No login needed — it's remembered on this device." },
    { screen: "menu", selector: "#streak-chip", title: "STREAKS",
      body: "Play once a day to build a daily streak. Win in a row to build a win streak. Both are ranked on the leaderboard." },
    { screen: "difficulty", selector: "#screen-difficulty .difficulty-cards", title: "DIFFICULTY",
      body: "Easy = 1 rule per task. Medium = 3. Hard = 5. Every task is freshly generated — nothing repeats, nothing contradicts itself." },
    { screen: "game", selector: "#rules-list", title: "THE RULES PANEL",
      body: "Your current task's rules appear here. Satisfy every rule at once to clear it." },
    { screen: "game", selector: ".code-editor", title: "THE EDITOR",
      body: 'Write assignments like name = 42, name = "hi", or name = ["a","b"]. Anything else is ignored.' },
    { screen: "game", selector: "#save-btn", title: "SYNC MEMORY",
      body: "Save before the timer hits zero, or the editor starts deleting your code from the bottom, one line per second." },
  ];

  let idx = 0;
  const overlay = document.getElementById("tutorial-overlay");

  function render() {
    const step = steps[idx];
    window.App.showScreen(step.screen, { forTutorial: true });

    requestAnimationFrame(() => {
      const target = document.querySelector(step.selector);
      if (!target) return next(); // not on screen for some reason, just skip

      const r = target.getBoundingClientRect();
      const pad = 8;

      overlay.innerHTML = "";
      overlay.classList.remove("hidden");

      const ring = document.createElement("div");
      ring.className = "tutorial-highlight-ring";
      ring.style.left = `${r.left - pad}px`;
      ring.style.top = `${r.top - pad}px`;
      ring.style.width = `${r.width + pad * 2}px`;
      ring.style.height = `${r.height + pad * 2}px`;
      overlay.appendChild(ring);

      const tooltip = document.createElement("div");
      tooltip.className = "tutorial-tooltip";
      const tipTop = r.bottom + 16 + 200 < window.innerHeight ? r.bottom + 16 : Math.max(16, r.top - 190);
      let tipLeft = r.left;
      if (tipLeft + 260 > window.innerWidth) tipLeft = window.innerWidth - 276;
      tooltip.style.top = `${tipTop}px`;
      tooltip.style.left = `${Math.max(16, tipLeft)}px`;
      tooltip.innerHTML = `
        <div class="tt-step">STEP ${idx + 1} / ${steps.length}</div>
        <div class="tt-title">${step.title}</div>
        <div class="tt-body">${step.body}</div>
        <div class="tt-actions">
          <span class="tt-skip" id="tt-skip">SKIP TUTORIAL</span>
          <button class="btn small primary" id="tt-next">${idx === steps.length - 1 ? "[ FINISH ]" : "[ NEXT ]"}</button>
        </div>`;
      overlay.appendChild(tooltip);

      document.getElementById("tt-next").onclick = next;
      document.getElementById("tt-skip").onclick = finish;
    });
  }

  function next() {
    idx++;
    if (idx >= steps.length) return finish();
    render();
  }

  function finish() {
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
    PlayerState.markTutorialDone();
    window.App.showScreen("menu");
  }

  function start() {
    idx = 0;
    render();
  }

  window.addEventListener("resize", () => { if (!overlay.classList.contains("hidden")) render(); });

  return { start };
})();