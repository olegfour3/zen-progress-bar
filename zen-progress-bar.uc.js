(() => {
  if (window.__zpbLoaded) {
    return;
  }
  window.__zpbLoaded = true;
  console.info("[zen-progress-bar] script loaded");

  const ROOT = document.documentElement;
  const ATTR = "zpb-active";
  const MODE_ATTR = "zpb-mode";
  const BAR_ID = "zpb-bar";
  const FINISH_MS = 150;
  // nsIWebProgressListener
  const STATE_START = 0x00000001;
  const STATE_IS_NETWORK = 0x00040000;

  /** @type {WeakMap<object, { ratio: number|null, determinate: boolean }>} */
  const progressByBrowser = new WeakMap();
  let finishTimer = null;
  let finishing = false;

  function selectedTab() {
    try {
      return gBrowser?.selectedTab ?? null;
    } catch {
      return null;
    }
  }

  function selectedBrowser() {
    try {
      return gBrowser?.selectedBrowser ?? null;
    } catch {
      return null;
    }
  }

  function isLoading() {
    if (ROOT.hasAttribute("zia-loading")) {
      return true;
    }
    const tab = selectedTab();
    if (!tab) {
      return false;
    }
    return tab.hasAttribute("busy") || tab.hasAttribute("progress");
  }

  function getState(browser) {
    if (!browser) {
      return { ratio: null, determinate: false };
    }
    let state = progressByBrowser.get(browser);
    if (!state) {
      state = { ratio: null, determinate: false };
      progressByBrowser.set(browser, state);
    }
    return state;
  }

  function clampRatio(n) {
    return Math.min(1, Math.max(0.02, n));
  }

  function ensureBar() {
    let bar = document.getElementById(BAR_ID);
    if (!bar) {
      bar = document.createXULElement("hbox");
      bar.id = BAR_ID;
      bar.setAttribute("layer", "true");
    }

    const panel =
      gBrowser?.selectedBrowser?.closest?.(".browserSidebarContainer") ||
      document.querySelector(".browserSidebarContainer.deck-selected");

    if (panel && bar.parentElement !== panel) {
      panel.insertBefore(bar, panel.firstChild);
    }
    return bar;
  }

  function applyProgress(bar, state) {
    const mode = state.determinate ? "determinate" : "indeterminate";
    ROOT.setAttribute(MODE_ATTR, mode);
    const p = state.determinate ? clampRatio(state.ratio ?? 0.02) : 0.02;
    bar.style.setProperty("--zpb-p", String(p));
  }

  function clearFinishTimer() {
    if (finishTimer) {
      window.clearTimeout(finishTimer);
      finishTimer = null;
    }
  }

  function hideBar() {
    finishing = false;
    ROOT.removeAttribute(ATTR);
    ROOT.removeAttribute(MODE_ATTR);
  }

  function finish() {
    if (finishing) {
      return;
    }
    finishing = true;
    clearFinishTimer();
    const bar = ensureBar();
    const browser = selectedBrowser();
    const state = getState(browser);
    state.ratio = 1;
    state.determinate = true;
    ROOT.setAttribute(ATTR, "true");
    applyProgress(bar, state);
    finishTimer = window.setTimeout(() => {
      finishTimer = null;
      hideBar();
      if (browser) {
        const s = getState(browser);
        s.ratio = null;
        s.determinate = false;
      }
    }, FINISH_MS);
  }

  function sync() {
    const on = isLoading();
    if (on) {
      if (finishing) {
        clearFinishTimer();
        finishing = false;
      }
      const bar = ensureBar();
      const state = getState(selectedBrowser());
      if (state.ratio == null) {
        state.ratio = 0.02;
        state.determinate = false;
      }
      ROOT.setAttribute(ATTR, "true");
      applyProgress(bar, state);
    } else if (ROOT.hasAttribute(ATTR) || finishing) {
      finish();
    }
  }

  function isSelectedBrowser(browser) {
    return Boolean(browser && browser === selectedBrowser());
  }

  new MutationObserver(sync).observe(ROOT, {
    attributes: true,
    attributeFilter: ["zia-loading"],
  });

  window.addEventListener("TabSelect", () => {
    ensureBar();
    sync();
  });

  const tabContainer = gBrowser?.tabContainer;
  if (tabContainer) {
    tabContainer.addEventListener("TabAttrModified", (event) => {
      const changed = event.detail?.changed;
      if (
        !changed ||
        changed.includes("busy") ||
        changed.includes("progress") ||
        changed.includes("pendingicon")
      ) {
        sync();
      }
    });
  }

  try {
    gBrowser.addTabsProgressListener({
      onStateChange(browser, webProgress, _request, flags) {
        if (!webProgress?.isTopLevel || !isSelectedBrowser(browser)) {
          return;
        }
        if (
          typeof flags === "number" &&
          (flags & STATE_START) &&
          (flags & STATE_IS_NETWORK)
        ) {
          const state = getState(browser);
          state.ratio = 0.02;
          state.determinate = false;
        }
        sync();
      },
      onProgressChange(
        browser,
        webProgress,
        _request,
        _curSelf,
        _maxSelf,
        curTotalProgress,
        maxTotalProgress
      ) {
        if (!webProgress?.isTopLevel || !isSelectedBrowser(browser)) {
          return;
        }
        const state = getState(browser);
        if (typeof maxTotalProgress === "number" && maxTotalProgress > 0) {
          state.ratio = clampRatio(curTotalProgress / maxTotalProgress);
          state.determinate = true;
        } else {
          state.determinate = false;
        }
        if (!isLoading()) {
          return;
        }
        const bar = ensureBar();
        ROOT.setAttribute(ATTR, "true");
        applyProgress(bar, state);
      },
      onLocationChange(browser, webProgress) {
        if (webProgress?.isTopLevel && isSelectedBrowser(browser)) {
          sync();
        }
      },
    });
  } catch {
    /* older / restricted hosts */
  }

  // ponytail: cheap backup if an event is missed (Zia/Zen attr races)
  window.setInterval(sync, 200);

  if (document.readyState === "complete") {
    ensureBar();
    sync();
  } else {
    window.addEventListener(
      "load",
      () => {
        ensureBar();
        sync();
      },
      { once: true }
    );
  }
})();
