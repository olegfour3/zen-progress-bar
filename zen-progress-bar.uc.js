(() => {
  if (window.__zpbLoaded) {
    return;
  }
  window.__zpbLoaded = true;
  console.info("[zen-progress-bar] script loaded");

  const ROOT = document.documentElement;
  const ATTR = "zpb-active";
  const BAR_ID = "zpb-bar";

  // nsIWebProgressListener (Zia uses STATE_IS_WINDOW for start/stop)
  let STATE_START = 0x00000001;
  let STATE_STOP = 0x00000010;
  let STATE_IS_WINDOW = 0x00080000;
  try {
    if (typeof Ci !== "undefined" && Ci.nsIWebProgressListener) {
      ({ STATE_START, STATE_STOP, STATE_IS_WINDOW } = Ci.nsIWebProgressListener);
    }
  } catch {
    /* keep numeric fallbacks */
  }

  const loader = {
    shown: 0,
    target: 0,
    active: false,
    finishing: false,
    estimateTimer: null,
    hideTimer: null,
    frame: null,
  };

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

  function isSelectedBrowser(browser) {
    return Boolean(browser && browser === selectedBrowser());
  }

  function tabIsLoading() {
    if (ROOT.hasAttribute("zia-loading")) {
      return true;
    }
    const tab = selectedTab();
    if (!tab) {
      return false;
    }
    return tab.hasAttribute("busy") || tab.hasAttribute("progress");
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

  function drawProgress() {
    const bar = ensureBar();
    bar.style.setProperty("--zpb-p", loader.shown.toFixed(4));
    ROOT.style.setProperty("--zpb-p", loader.shown.toFixed(4));
  }

  function stopLoaderTimers() {
    if (loader.estimateTimer) {
      clearInterval(loader.estimateTimer);
      loader.estimateTimer = null;
    }
    if (loader.hideTimer) {
      clearTimeout(loader.hideTimer);
      loader.hideTimer = null;
    }
  }

  function animateLoader() {
    loader.frame = null;
    const diff = loader.target - loader.shown;
    const next =
      loader.shown +
      (Math.abs(diff) < 0.001 ? diff : diff * (loader.finishing ? 0.3 : 0.12));
    loader.shown = Math.max(loader.shown, next);
    drawProgress();
    if (loader.finishing && loader.shown >= 0.999) {
      loader.finishing = false;
      loader.hideTimer = setTimeout(() => {
        loader.hideTimer = null;
        ROOT.removeAttribute(ATTR);
      }, 150);
      return;
    }
    if (loader.active || loader.finishing) {
      loader.frame = requestAnimationFrame(animateLoader);
    }
  }

  function runLoader() {
    if (!loader.frame) {
      loader.frame = requestAnimationFrame(animateLoader);
    }
  }

  function startLoader(from = 0.02, fresh = false) {
    const stillShowing =
      loader.active || loader.finishing || ROOT.hasAttribute(ATTR);
    stopLoaderTimers();
    loader.active = true;
    loader.finishing = false;
    if (fresh || !stillShowing) {
      loader.shown = from;
      loader.target = Math.max(from, 0.25);
      drawProgress();
    } else {
      loader.target = Math.max(loader.target, loader.shown, from);
    }
    ROOT.setAttribute(ATTR, "true");
    loader.estimateTimer = setInterval(() => {
      if (loader.target < 0.9) {
        loader.target += (0.9 - loader.target) * 0.06;
      }
    }, 250);
    runLoader();
  }

  function reportRealProgress(fraction) {
    if (loader.active && fraction > loader.target) {
      loader.target = Math.min(0.95, fraction);
    }
  }

  function finishLoader() {
    if (!loader.active) {
      return;
    }
    stopLoaderTimers();
    loader.active = false;
    loader.finishing = true;
    loader.target = 1;
    ROOT.setAttribute(ATTR, "true");
    runLoader();
  }

  function cancelLoader() {
    stopLoaderTimers();
    if (loader.frame) {
      cancelAnimationFrame(loader.frame);
      loader.frame = null;
    }
    loader.active = false;
    loader.finishing = false;
    loader.shown = 0;
    loader.target = 0;
    ROOT.removeAttribute(ATTR);
  }

  // Backup: Zia flag / busy without our window-state events
  function syncFromBusy() {
    const on = tabIsLoading();
    if (on) {
      if (!loader.active && !loader.finishing) {
        startLoader();
      }
    } else if (loader.active) {
      finishLoader();
    }
  }

  new MutationObserver(syncFromBusy).observe(ROOT, {
    attributes: true,
    attributeFilter: ["zia-loading"],
  });

  window.addEventListener("TabSelect", () => {
    ensureBar();
    if (tabIsLoading()) {
      startLoader(0.25, true);
    } else {
      cancelLoader();
    }
  });

  const tabContainer = gBrowser?.tabContainer;
  if (tabContainer) {
    tabContainer.addEventListener("TabAttrModified", (event) => {
      if (event.target !== selectedTab()) {
        return;
      }
      const changed = event.detail?.changed;
      if (
        !changed ||
        changed.includes("busy") ||
        changed.includes("progress") ||
        changed.includes("pendingicon")
      ) {
        syncFromBusy();
      }
    });
  }

  try {
    gBrowser.addTabsProgressListener({
      onStateChange(browser, webProgress, _request, stateFlags) {
        if (!webProgress?.isTopLevel || !(stateFlags & STATE_IS_WINDOW)) {
          return;
        }
        if (!isSelectedBrowser(browser)) {
          return;
        }
        if (stateFlags & STATE_START) {
          startLoader();
        } else if (stateFlags & STATE_STOP) {
          finishLoader();
        }
      },
      onProgressChange(
        browser,
        webProgress,
        _request,
        _curSelf,
        _maxSelf,
        curTotal,
        maxTotal
      ) {
        if (!isSelectedBrowser(browser) || !(maxTotal > 0)) {
          return;
        }
        reportRealProgress(curTotal / maxTotal);
      },
    });
  } catch {
    /* older / restricted hosts */
  }

  // ponytail: cheap backup if an event is missed (Zia/Zen attr races)
  window.setInterval(syncFromBusy, 200);

  if (document.readyState === "complete") {
    ensureBar();
    syncFromBusy();
  } else {
    window.addEventListener(
      "load",
      () => {
        ensureBar();
        syncFromBusy();
      },
      { once: true }
    );
  }
})();
